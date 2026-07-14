import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";


interface SuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Success({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params?.session_id;

  if (!sessionId || typeof sessionId !== "string") {
    return (
      <section className="max-w-md mx-auto mt-40 p-6 bg-white dark:bg-slate-900 border rounded-2xl text-center shadow-xl">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Invalid Payment Session</h2>
        <p className="text-slate-500">Session ID was not found in the URL.</p>
        <a href="/funding" className="inline-block mt-6 bg-[#db0000] hover:bg-red-900 text-white px-6 py-2 rounded-xl text-sm font-semibold">
          Back to Funding
        </a>
      </section>
    );
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error("Stripe session retrieval error:", error);
    return (
      <section className="max-w-md mx-auto mt-40 p-6 bg-white dark:bg-slate-900 border rounded-2xl text-center shadow-xl">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Payment Verification Failed</h2>
        <p className="text-slate-500">Unable to verify your payment session.</p>
      </section>
    );
  }

  if (session.status === "open") {
    redirect("/");
  }

  if (session.status === "complete") {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

      await fetch(`${backendUrl}/api/funding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          stripeSessionId: session.id,
          name: session.metadata?.userName || session.customer_details?.name || "",
          email: session.metadata?.userEmail || session.customer_details?.email || "",
          amount: (session.amount_total || 0) / 100,
          status: "success",
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        }),
      });
    } catch (error) {
      console.error("Funding data save failed in DB:", error);
    }

    return (
      <section className="max-w-md mx-auto mb-10 mt-40 p-6 bg-white dark:bg-slate-900 border rounded-2xl text-center shadow-xl">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Payment Successful!</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Thank you for your support, 
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {" "}
            {session.metadata?.userName || session.customer_details?.name || "Donor"}
          </span>.
        </p>

        {session.customer_details?.email && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
            Confirmation sent to: <span className="font-medium">{session.customer_details.email}</span>
          </p>
        )}

        <a href="/funding" className="inline-block bg-[#db0000] hover:bg-slate-900 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
          Go Back to Funding Page
        </a>
      </section>
    );
  }

  return (
    <section className="max-w-md mx-auto mt-40 p-6 bg-white dark:bg-slate-900 border rounded-2xl text-center shadow-xl">
      <h2 className="text-xl font-bold text-yellow-500 mb-4">Payment Status Unknown</h2>
      <p className="text-slate-500 text-sm">Please contact support if money was deducted from your account.</p>
    </section>
  );
}