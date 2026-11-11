
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Home, Map, Plus, Building2, MapPin, Star,
  ArrowRight, Wallet, CheckCircle2, X,
  CalendarX2, RotateCcw, ChevronLeft
} from 'lucide-react';

const TransportMap = dynamic(
  () => import('../components/TransportMap'),
  { ssr: false }
);

const deals = [
  {
    icon: '🎉',
    name: 'Welcome Offer',
    description: 'Get 10% off your next eligible journey',
    code: 'WELCOME10',
    off: '10% OFF'
  },
  {
    icon: '🚌',
    name: 'Bus Saver',
    description: 'Save AED 5 on an eligible bus journey',
    code: 'BUS5',
    off: 'AED 5 OFF'
  },
  {
    icon: '🚕',
    name: 'Taxi Deal',
    description: 'Save on selected taxi journeys',
    code: 'TAXI7',
    off: 'AED 7 OFF'
  },
  {
    icon: '🛴',
    name: 'Scooter Saver',
    description: 'Get a discount on eligible scooter rides',
    code: 'SCOOT5',
    off: '5% OFF'
  }
];

export default function Page() {
  const [screen, setScreen] = useState('dashboard');
  const [balance, setBalance] = useState(250);
  const [amount, setAmount] = useState('50');
  const [feedback, setFeedback] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [creditSuccess, setCreditSuccess] = useState(null);
  const [bookingAction, setBookingAction] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('Confirmed');

  const bookingReference = 'UAT-DEMO-2048';

  function navigate(next) {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function topUp(e) {
    e.preventDefault();

    const value = Number(amount);

    if (
      amount === '' ||
      !Number.isFinite(value) ||
      value < 1 ||
      value > 1000
    ) {
      setFeedback('Enter an amount between AED 1 and AED 1,000.');
      return;
    }

    const newBalance = Math.round((balance + value) * 100) / 100;

    setBalance(newBalance);
    setFeedback('');

    setCreditSuccess({
      amount: value,
      newBalance: newBalance
    });
  }

  function manageBooking(action) {
    setBookingAction(action);

    setBookingStatus(
      action === 'cancel'
        ? 'Cancelled'
        : 'Refund requested'
    );

    navigate('booking-success');
  }

  return (
    <div className="app-shell">

      {/* DASHBOARD SCREEN */}
      {screen === 'dashboard' && (
        <main className="main-content">

          <header className="mini-header">
            <span className="mini-title">
              UAE Transport
            </span>

            <div className="mini-credit">
              <span>Credits</span>
              <strong>
                {balance.toLocaleString('en-AE', {
                  maximumFractionDigits: 0
                })}
              </strong>
            </div>
          </header>

          {/* DIGITAL CARD */}
          <section
            className="digital-card"
            aria-label="Simulated transport card"
          >
            <div className="card-top">
              <strong>UAE Transport</strong>
              <Wallet size={25} strokeWidth={1.8} />
            </div>

            <div className="card-balance-wrap">
              <div className="card-label">
                Available Balance
              </div>

              <div className="card-balance">
                AED{' '}
                {balance.toLocaleString('en-AE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>

            <div className="card-bottom">
              <div>
                <div>4829 •••• •••• 2048</div>
                <small>DEMO PASSENGER</small>
              </div>
              <small>DEMO CARD</small>
            </div>
          </section>

          {/* YOUR JOURNEY */}
          <section
            className="journey-section"
            aria-label="Journey progress"
          >
            <h2>Your Journey</h2>

            <div className="journey-row">
              <div>
                <span className="place-label">From</span>
                <strong>Dubai Mall</strong>
              </div>

              <ArrowRight
                className="journey-arrow"
                size={24}
              />

              <div className="end-place">
                <span className="place-label">To</span>
                <strong>Dubai Marina</strong>
              </div>
            </div>

            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={60}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Journey 60 percent complete"
            >
              <div className="progress-fill" />
            </div>

            <div className="progress-meta">
              <span>Started</span>
              <strong>60% Complete</strong>
            </div>

            <button
              type="button"
              className="manage-journey-btn"
              onClick={() => navigate('manage-booking')}
            >
              Manage booking
              <ArrowRight size={16} />
            </button>
          </section>

          {/* SAVED LOCATIONS */}
          <section
            className="saved-section"
            aria-label="Saved locations"
          >
            <h2>Saved Locations</h2>
            <p>Quickly access your favourite places</p>

            <div className="h-scroll locations-scroll">
              {[
                { label: 'Home', Icon: Home },
                { label: 'Work', Icon: Building2 },
                { label: 'Add Location', Icon: Plus },
                { label: 'Saved Place', Icon: MapPin },
                { label: 'Favourite', Icon: Star }
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  className="location-item"
                  title={label}
                  aria-label={label}
                  onClick={() => setSelectedLocation(label)}
                >
                  <Icon size={32} strokeWidth={1.75} />
                </button>
              ))}
            </div>

            {selectedLocation && (
              <p className="location-feedback" role="status">
                {selectedLocation} selected (demo)
              </p>
            )}
          </section>

          {/* TOP UP CARD */}
          <section
            className="topup-container"
            aria-label="Top up card"
          >
            <div className="topup-heading">
              <div className="topup-icon">
                <Wallet size={24} />
              </div>

              <div>
                <h2>Top Up Card</h2>
                <p>Add credits to your transport wallet</p>
              </div>
            </div>

            <form onSubmit={topUp}>
              <div className="amount-caption">
                Choose an amount
              </div>

              <div className="quick-amounts">
                {['25', '50', '100'].map(a => (
                  <button
                    key={a}
                    type="button"
                    className={
                      amount === a
                        ? 'quick-option selected'
                        : 'quick-option'
                    }
                    onClick={() => {
                      setAmount(a);
                      setFeedback('');
                    }}
                  >
                    AED {a}
                  </button>
                ))}
              </div>

              <label
                className="amount-label"
                htmlFor="topup-amount"
              >
                Amount (AED)
              </label>

              <input
                id="topup-amount"
                type="number"
                inputMode="decimal"
                min="1"
                max="1000"
                step="0.01"
                value={amount}
                onChange={e => {
                  setAmount(e.target.value);
                  setFeedback('');
                }}
              />

              <button className="add-credits" type="submit">
                <Plus size={19} />
                Add Credits
              </button>
            </form>

            {feedback && (
              <p className="topup-feedback" role="status">
                {feedback}
              </p>
            )}
          </section>

          {/* COUPONS AND DEALS */}
          <section
            className="deals-section"
            aria-label="Coupons and deals"
          >
            <h2>Coupons &amp; Deals</h2>

            <div className="h-scroll deals-scroll">
              {deals.map(d => (
                <article className="coupon-card" key={d.code}>
                  <div className="coupon-header">
                    <div className="coupon-copy">
                      <h3>{d.icon} {d.name}</h3>
                      <p>{d.description}</p>
                      <span>Code: {d.code}</span>
                    </div>

                    <strong className="coupon-off">
                      {d.off}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <p className="disclaimer">
            All cards, balances, journeys and offers are
            simulated for usability testing.
          </p>
        </main>
      )}

      {/* MANAGE BOOKING SCREEN */}
      {screen === 'manage-booking' && (
        <main className="main-content booking-content">

          <button
            className="back-link"
            onClick={() => navigate('dashboard')}
          >
            <ChevronLeft size={17} />
            Dashboard
          </button>

          <h1>Manage Booking</h1>

          <p className="booking-intro">
            Review your journey and the sample cancellation
            or refund policy before continuing.
          </p>

          <div className="booking-details">
            <span className="booking-tag">
              {bookingStatus}
            </span>

            <h2>
              Dubai Mall
              <ArrowRight size={18} />
              Dubai Marina
            </h2>

            <p>
              Booking reference:
              <strong> {bookingReference}</strong>
            </p>

            <p>Transport: Bus · Demo journey</p>
          </div>

          <section className="policy-panel">
            <h2>Cancellation &amp; Refund Policy</h2>

            <p>
              <strong>For usability testing only:</strong>
              {' '}This is an illustrative policy, not an
              actual UAE transport operator's policy.
            </p>

            <ul>
              <li>
                Cancellation requests can be submitted
                before the journey starts.
              </li>
              <li>
                Refund eligibility and any fees depend
                on the operator's applicable rules.
              </li>
              <li>
                A refund request does not mean a refund
                has been approved or paid.
              </li>
              <li>
                Review the operator's final terms
                before confirming a real booking.
              </li>
            </ul>
          </section>

          <div className="booking-actions">
            <button
              type="button"
              className="cancel-booking"
              disabled={bookingStatus !== 'Confirmed'}
              onClick={() => manageBooking('cancel')}
            >
              <CalendarX2 size={18} />
              Confirm Demo Cancellation
            </button>

            <button
              type="button"
              className="refund-booking"
              disabled={bookingStatus === 'Refund requested'}
              onClick={() => manageBooking('refund')}
            >
              <RotateCcw size={18} />
              Request Demo Refund
            </button>
          </div>
        </main>
      )}

      {/* SEPARATE SUCCESS SCREEN */}
      {screen === 'booking-success' && (
        <main className="main-content booking-success-page">

          <div className="booking-success-icon">
            <CheckCircle2 size={45} />
          </div>

          <h1>
            {bookingAction === 'cancel'
              ? 'Booking Cancelled'
              : 'Refund Request Submitted'}
          </h1>

          <p>
            {bookingAction === 'cancel'
              ? 'Your demo booking has been marked as cancelled.'
              : 'Your simulated refund request has been recorded. No money has been transferred.'}
          </p>

          <div className="booking-details">
            <p>
              Booking reference:
              <strong> {bookingReference}</strong>
            </p>

            <p>
              Status:
              <strong> {bookingStatus}</strong>
            </p>
          </div>

          <section className="policy-panel">
            <h2>What happens next?</h2>

            <p>
              {bookingAction === 'cancel'
                ? "In a real app, refund eligibility would be evaluated against the transport operator's policy."
                : 'In a real app, a provider would assess eligibility and communicate an approval or rejection.'}
            </p>

            <p>
              <strong>Demo only:</strong>
              {' '}No actual booking, cancellation or refund
              has occurred.
            </p>
          </section>

          <button
            className="add-credits"
            onClick={() => navigate('dashboard')}
          >
            Return to Dashboard
          </button>
        </main>
      )}

      {/* MAPS SCREEN */}
      {screen === 'maps' && (
        <main className="main-content maps-content">

          <header className="mini-header">
            <span className="mini-title">Maps</span>

            <div className="mini-credit">
              <span>Credits</span>
              <strong>{Math.round(balance)}</strong>
            </div>
          </header>

          <h1>Explore transport locations</h1>

          <p className="map-sub">
            Tap a marker to view a sample location
            around Dubai.
          </p>

          <TransportMap />

          <div className="map-note">
            <MapPin size={18} />
            Map markers and the dashed line are demo data;
            the line is not an actual route.
          </div>
        </main>
      )}

      {/* TOP UP SUCCESS POPUP */}
      {creditSuccess && (
        <div
          className="modal-backdrop"
          onMouseDown={e => {
            if (e.target === e.currentTarget) {
              setCreditSuccess(null);
            }
          }}
        >
          <div
            className="success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="credit-success-title"
          >

            <button
              type="button"
              className="modal-close"
              aria-label="Close confirmation"
              onClick={() => setCreditSuccess(null)}
            >
              <X size={20} />
            </button>

            <div className="success-icon">
              <CheckCircle2 size={39} />
            </div>

            <h2 id="credit-success-title">
              Top Up Successful!
            </h2>

            <p>
              AED {creditSuccess.amount.toFixed(2)}
              {' '}has been added to your demo wallet.
            </p>

            <div className="updated-balance">
              <span>Updated balance</span>
              <strong>
                AED {creditSuccess.newBalance.toFixed(2)}
              </strong>
            </div>

            <button
              type="button"
              className="add-credits"
              onClick={() => setCreditSuccess(null)}
            >
              Done
            </button>

            <small>
              Simulated transaction — no actual payment
              was taken.
            </small>

          </div>
        </div>
      )}

      {/* FIXED BOTTOM NAVIGATION */}
      <nav
        className="bottom-navigation"
        aria-label="Primary navigation"
      >
        <button
          type="button"
          className={
            screen === 'dashboard'
              ? 'nav-link active'
              : 'nav-link'
          }
          onClick={() => navigate('dashboard')}
        >
          <Home size={23} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={
            screen === 'maps'
              ? 'nav-link active'
              : 'nav-link'
          }
          onClick={() => navigate('maps')}
        >
          <Map size={23} />
          <span>Maps</span>
        </button>
      </nav>

    </div>
  );
}
