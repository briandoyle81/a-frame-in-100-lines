import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  // export interface FrameValidationData {
  //   button: number; // Number of the button clicked
  //   following: boolean; // Indicates if the viewer clicking the frame follows the cast author
  //   input: string; // Text input from the viewer typing in the frame
  //   interactor: {
  //     fid: number; // Viewer Farcaster ID
  //     custody_address: string; // Viewer custody address
  //     verified_accounts: string[]; // Viewer account addresses
  //   };
  //   liked: boolean; // Indicates if the viewer clicking the frame liked the cast
  //   raw: NeynarFrameValidationInternalModel;
  //   recasted: boolean; // Indicates if the viewer clicking the frame recasted the cast
  //   valid: boolean; // Indicates if the frame is valid
  // }

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  if (message?.input) {
    text = message.input;
  }

  if (message?.button === 3) {
    return NextResponse.redirect(
      'https://www.google.com/search?q=cute+dog+pictures&tbm=isch&source=lnms',
      { status: 302 },
    );
  }

  if (message?.following) {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Thanks for following!`,
          },
        ],
        image: `${NEXT_PUBLIC_URL}/park-2.png`,
        // post_url: `${NEXT_PUBLIC_URL}/api/frame`,
      }),
    );
  } else {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Follow and try again!`,
          },
        ],
        image: `${NEXT_PUBLIC_URL}/park-2.png`,
        post_url: `${NEXT_PUBLIC_URL}/api/frame`,
      }),
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
