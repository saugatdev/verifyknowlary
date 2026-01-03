import { getCertificatesCollection } from '@/cluster/mongo-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchId = decodeURIComponent(params.id || '').trim();
    
    if (!searchId) {
      return NextResponse.json(
        { message: 'Credential id required' },
        { status: 400 }
      );
    }

    const collection = await getCertificatesCollection();
    const doc = await collection.findOne({
      $or: [{ id: searchId }, { verificationCode: searchId }],
    });

    if (!doc) {
      return NextResponse.json(
        { message: 'Certificate not found' },
        { status: 404 }
      );
    }

    const { _id, ...rest } = doc;
    const issueDate = doc.issueDate instanceof Date
      ? doc.issueDate.toISOString().slice(0, 10)
      : doc.issueDate;

    return NextResponse.json({ ...rest, issueDate });
  } catch (err) {
    console.error('Verification lookup failed', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
