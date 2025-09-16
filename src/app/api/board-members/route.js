
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
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const position = formData.get('position');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const bio = formData.get('bio');
    const avatarFile = formData.get('avatar');

    const memberData = { name, position, email, phone, bio };

    if (avatarFile && typeof avatarFile === 'object' && avatarFile.size > 0) {
        try {
            const imagePath = await saveImage(avatarFile, 'avatars');
            memberData.avatar = imagePath;
        } catch (error) {
            console.error("Image save error:", error);
            return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
        }
    }
    
    const newBoardMember = new BoardMemberModel(memberData);
    const savedBoardMember = await newBoardMember.save();
    return NextResponse.json(savedBoardMember, { status: 201 });

  } catch (error) {
    console.error("Board Member POST Error:", error);
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return NextResponse.json({ error: `A board member with this ${field} already exists.` }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create board member', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        let updateData = {};
        const contentType = request.headers.get("content-type");

        if (contentType && contentType.includes('multipart/form-data')) {
          const formData = await request.formData();
          updateData = {
            name: formData.get('name'),
            position: formData.get('position'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            bio: formData.get('bio'),
          };
          
          const avatarFile = formData.get('avatar');
          if (avatarFile && typeof avatarFile === 'object' && avatarFile.size > 0) {
              try {
                  const imagePath = await saveImage(avatarFile, 'avatars');
                  updateData.avatar = imagePath;
              } catch (error) {
                  console.error("Image save error on PUT:", error);
                  return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
              }
          }
        } else {
            updateData = await request.json();
        }

        const updatedBoardMember = await BoardMemberModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        
        if (!updatedBoardMember) {
            return NextResponse.json({ error: 'Board member not found' }, { status: 404 });
        }
        return NextResponse.json(updatedBoardMember);

    } catch (error) {
        console.error("Board Member PUT Error:", error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return NextResponse.json({ error: `A board member with this ${field} already exists.` }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to update board member', details: error.message }, { status: 500 });
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
        console.error("Board Member DELETE Error:", error);
        return NextResponse.json({ error: 'Failed to delete board member', details: error.message }, { status: 500 });
    }
}
