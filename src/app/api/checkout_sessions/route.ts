import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';


interface CheckoutRequestBody {
  amount: number;
}

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin');

    if (!origin) {
      return NextResponse.json(
        { error: 'Origin missing from headers' },
        { status: 400 }
      );
    }

    const { amount }: CheckoutRequestBody = await req.json();

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amount * 100);

   
    const sessionData = await auth.api.getSession({
      headers: headersList,
    });

    const userEmail = sessionData?.user?.email;
    const userName = sessionData?.user?.name;

    
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Project Funding Contribution',
              description: 'Thank you for supporting our platform!',
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/funding/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
      metadata: {
        userName: userName || 'Anonymous Donor',
        userEmail: userEmail || '',
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (err: unknown) {
    
    const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
    const statusCode = (err as { statusCode?: number })?.statusCode || 500;

    console.error("Stripe Checkout Error:", err);

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}