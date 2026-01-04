
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  ShieldCheck,
  Truck,
  User,
} from 'lucide-react';

import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { useAuth } from '@/hooks/useAuth';
import { CartItem } from '@/types/cart';
import { calculateCartTotals, clearCart, loadCart } from '@/utils/cartStorage';

type CheckoutStep = 0 | 1 | 2;

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [step, setStep] = useState<CheckoutStep>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [contact, setContact] = useState({
    fullName: '',
    phone: '',
    email: '',
    save: true,
  });

  const [delivery, setDelivery] = useState({
    address: '',
    city: '',
    postalCode: '',
    preferredDate: '',
    preferredTime: '',
    instructions: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || loading) return;
    const cart = loadCart(user.id);
    setCartItems(cart);
    setCartLoaded(true);
  }, [user, loading]);

  useEffect(() => {
    if (!loading && user && cartLoaded && cartItems.length === 0) {
      router.push('/cart');
    }
  }, [loading, user, cartItems.length, cartLoaded, router]);

  const { subtotal, shipping, total } = useMemo(() => calculateCartTotals(cartItems), [cartItems]);

  const steps = useMemo(
    () => [
      {
        id: 0 as CheckoutStep,
        title: 'Contact Info',
        Icon: User,
      },
      {
        id: 1 as CheckoutStep,
        title: 'Delivery Details',
        Icon: Truck,
      },
      {
        id: 2 as CheckoutStep,
        title: 'Confirmed',
        Icon: CircleCheck,
      },
    ],
    []
  );

  const canContinueFromContact =
    contact.fullName.trim().length > 0 &&
    contact.phone.trim().length > 0 &&
    contact.email.trim().length > 0;

  const canContinueFromDelivery =
    delivery.address.trim().length > 0 &&
    delivery.city.trim().length > 0 &&
    delivery.postalCode.trim().length > 0;

  const handleNext = async () => {
    if (submitting) return;
    if (step === 0) {
      if (!canContinueFromContact) return;
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!canContinueFromDelivery) return;

      if (!user) return;
      setSubmitting(true);
      setStep(2);

      window.setTimeout(() => {
        clearCart(user.id);
        router.push('/');
      }, 2200);

      window.setTimeout(() => {
        setSubmitting(false);
      }, 2500);

      return;
    }
  };

  const handleBack = () => {
    if (submitting) return;
    setStep((prev) => (prev === 0 ? 0 : ((prev - 1) as CheckoutStep)));
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-900">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative">
      <Navbar />
      <section className="relative w-full overflow-hidden bg-white pt-24 pb-10 sm:pt-28 sm:pb-20 lg:pb-24 min-h-screen">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl">
              Checkout
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-900">
              <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
              <span>Secure checkout</span>
            </div>
          </div>

          <div className="mb-10">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center justify-between">
                {steps.map((s, idx) => {
                  const isActive = step === s.id;
                  const isComplete = step > s.id;
                  const isLast = idx === steps.length - 1;
                  const Icon = s.Icon;

                  return (
                    <div key={s.title} className="flex-1">
                      <div className="flex items-center">
                        <div
                          className={
                            'flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200 ' +
                            (isComplete
                              ? 'bg-green-600 border-green-600 text-white'
                              : isActive
                                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                                : 'bg-gray-100 border-gray-200 text-gray-800')
                          }
                        >
                          {isComplete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                        </div>

                        {!isLast && (
                          <div className="mx-3 h-0.5 flex-1 bg-gray-200">
                            <div
                              className={
                                'h-0.5 transition-all duration-300 ' +
                                (step > s.id ? 'w-full bg-green-600' : 'w-0 bg-green-600')
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        <p
                          className={
                            'text-xs font-semibold ' +
                            (isComplete ? 'text-green-700' : isActive ? 'text-[#b28f1f]' : 'text-gray-900')
                          }
                        >
                          {s.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {step !== 2 ? (
                <div className="rounded-4xl border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                  {step === 0 ? (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                      <div className="mt-6 space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                          <input
                            value={contact.fullName}
                            onChange={(e) => setContact((p) => ({ ...p, fullName: e.target.value }))}
                            placeholder="John Doe"
                            className="mt-2 w-full text-black rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm  font-semibold text-gray-700">Phone Number</label>
                          <input
                            value={contact.phone}
                            onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                            placeholder="+233 50 000 0000"
                            className="mt-2 w-full text-black rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                          <input
                            value={contact.email}
                            onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                            placeholder="john@example.com"
                            type="email"
                            className="mt-2 w-full text-black rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <label className="flex items-center gap-3 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={contact.save}
                            onChange={(e) => setContact((p) => ({ ...p, save: e.target.checked }))}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <span>Save contact information for future orders</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Delivery Details</h2>
                      <div className="mt-6 space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700">Street Address</label>
                          <input
                            value={delivery.address}
                            onChange={(e) => setDelivery((p) => ({ ...p, address: e.target.value }))}
                            placeholder="123 Main Street, Apt 4B"
                            className="mt-2 w-full text-black rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700">City</label>
                            <input
                              value={delivery.city}
                              onChange={(e) => setDelivery((p) => ({ ...p, city: e.target.value }))}
                              placeholder="Accra"
                              className="mt-2 w-full text-black rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700">Postal Code</label>
                            <input
                              value={delivery.postalCode}
                              onChange={(e) => setDelivery((p) => ({ ...p, postalCode: e.target.value }))}
                              placeholder="00233"
                              className="mt-2 w-full text-black rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700">Preferred Delivery Date</label>
                            <input
                              value={delivery.preferredDate}
                              onChange={(e) => setDelivery((p) => ({ ...p, preferredDate: e.target.value }))}
                              type="date"
                              className="mt-2 w-full text-black rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700">Preferred Time</label>
                            <select
                              value={delivery.preferredTime}
                              onChange={(e) => setDelivery((p) => ({ ...p, preferredTime: e.target.value }))}
                              className="mt-2 w-full text-black rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                            >
                              <option value="">Select time</option>
                              <option value="9am-12pm">9am - 12pm</option>
                              <option value="12pm-3pm">12pm - 3pm</option>
                              <option value="3pm-6pm">3pm - 6pm</option>
                              <option value="6pm-9pm">6pm - 9pm</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700">Special Instructions</label>
                          <textarea
                            value={delivery.instructions}
                            onChange={(e) => setDelivery((p) => ({ ...p, instructions: e.target.value }))}
                            placeholder="Any special delivery instructions..."
                            rows={4}
                            className="mt-2 w-full text-black resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      onClick={handleBack}
                      disabled={step === 0 || submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={
                        submitting ||
                        (step === 0 ? !canContinueFromContact : step === 1 ? !canContinueFromDelivery : true)
                      }
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all duration-200 hover:bg-[#e3c55d] hover:shadow-[0_6px_24px_rgba(212,175,55,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-4xl border border-gray-200 bg-white p-10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                  <div className="mx-auto max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                      <div className="relative">
                        <CircleCheck className="h-14 w-14 text-green-600 animate-[pop_650ms_ease-out]" />
                        <span className="absolute inset-0 rounded-full bg-green-500/10 animate-[ping_1.2s_ease-out_infinite]" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Order confirmed</h2>
                    <p className="mt-2 text-sm text-gray-900">
                      Thanks {contact.fullName ? contact.fullName : 'there'} — we’re preparing your order.
                    </p>
                    <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left text-sm text-gray-900">
                      <p className="font-semibold text-gray-900">Delivery</p>
                      <p className="mt-1">{delivery.address || '—'}</p>
                      <p className="mt-1">
                        {(delivery.city || '—') + (delivery.postalCode ? `, ${delivery.postalCode}` : '')}
                      </p>
                      <p className="mt-3 text-xs text-gray-700">Redirecting you to home…</p>
                    </div>

                    <Link
                      href="/"
                      className="mt-8 inline-flex w-full items-center justify-center rounded-full border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                    >
                      Back to home now
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-4xl border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Order Review</h2>

                <div className="space-y-4">
                  {cartItems.slice(0, 3).map((item, idx) => (
                    <div key={`${item.product.title}-${item.size_ml}-${idx}`} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100 shrink-0">
                        {item.product.image ? (
                          <Image src={item.product.image} alt={item.product.title} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">{item.product.title}</p>
                        <p className="text-xs text-gray-800">
                          Qty: {item.quantity} · {item.size_ml}ml
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#b28f1f]">
                        ₵{(item.product.price * item.quantity).toLocaleString('en-US')}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">₵{subtotal.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className="font-semibold">₵{shipping.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-4">
                    <span>Total</span>
                    <span>₵{total.toLocaleString('en-US')}</span>
                  </div>
                </div>

                <Link
                  href="/cart"
                  className="mt-6 block w-full text-center text-sm font-semibold text-gray-900 transition-colors duration-200 hover:text-[#D4AF37]"
                >
                  Edit cart
                </Link>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes pop {
            0% {
              transform: scale(0.85);
              opacity: 0.2;
            }
            60% {
              transform: scale(1.08);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </section>
      <Footer />
    </div>
  );
}

