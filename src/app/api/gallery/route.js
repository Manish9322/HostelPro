
import _db from "@/utils/db";
import GalleryImageModel from "@/models/gallery.model";
import { NextResponse } from "next/server";
import { saveImage } from "@/utils/file-manager";

export async function GET() {
  await _db();
  const images = await GalleryImageModel.find({}).sort({ order: 1 });
  return NextResponse.json(images);
}

export async function POST(request) {
  await _db();
  const formData = await request.formData();
  const imageFile = formData.get('image');
  const altText = formData.get('alt');
  
  if (!imageFile) {
    return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
  }

  try {
    const imageUrl = await saveImage(imageFile, 'gallery');
    const count = await GalleryImageModel.countDocuments();
    
    const newImage = new GalleryImageModel({
      url: imageUrl,
      alt: altText,
      order: count,
    });
    
    const savedImage = await newImage.save();
    return NextResponse.json(savedImage, { status: 201 });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }
}

export async function DELETE(request) {
    await _db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        const deletedImage = await GalleryImageModel.findByIdAndDelete(id);
        if (!deletedImage) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }
        // Ideally, also delete the file from the filesystem here
        return NextResponse.json({ message: 'Image deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

    
