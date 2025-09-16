
import _db from "@/utils/db";
import BoardMemberModel from "@/models/boardMember.model";
import { NextResponse } from "next/server";
import { saveImage } from "@/utils/file-manager";

export async function GET(request) {
  await _db();
  const { searchParams } = new URL(request.url);
  const visibleOnly = searchParams.get('visible') === 'true';
  
  const query = visibleOnly ? { visible: true } : {};
  const boardMembers = await BoardMemberModel.find(query);
  return NextResponse.json(boardMembers);
}

export async function POST(request) {
  await _db();
  const formData = await request.formData();
  const name = formData.get('name');
  const position = formData.get('position');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const bio = formData.get('bio');
  const avatarFile = formData.get('avatar');

  const memberData = { name, position, email, phone, bio };

  if (avatarFile && avatarFile.size > 0) {
      try {
          const imagePath = await saveImage(avatarFile, 'avatars');
          memberData.avatar = imagePath;
      } catch (error) {
          return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
      }
  }
  
  const newBoardMember = new BoardMemberModel(memberData);
  const savedBoardMember = await newBoardMember.save();
  return NextResponse.json(savedBoardMember, { status: 201 });
}

export async function PUT(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    let updateData = {};
    const contentType = request.headers.get("content-type");

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const name = formData.get('name');
      const position = formData.get('position');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const bio = formData.get('bio');
      const avatarFile = formData.get('avatar');

      updateData = { name, position, email, phone, bio };

      if (avatarFile && avatarFile.size > 0) {
          try {
              const imagePath = await saveImage(avatarFile, 'avatars');
              updateData.avatar = imagePath;
          } catch (error) {
              return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
          }
      }
    } else {
        updateData = await request.json();
    }


    try {
        const updatedBoardMember = await BoardMemberModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedBoardMember) {
            return NextResponse.json({ error: 'Board member not found' }, { status: 404 });
        }
        return NextResponse.json(updatedBoardMember);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const deletedBoardMember = await BoardMemberModel.findByIdAndDelete(id);
        if (!deletedBoardMember) {
            return NextResponse.json({ error: 'Board member not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Board member deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

