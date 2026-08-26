import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { PhoneCall, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import LiveChatAssistant from './LiveChatAssistant';

export default function HelpCenter() {
  const { language, t } = useBooking();
  const [openFaq, setOpenFaq] = useState(0);

  const faqsEn = [
    {
      q: "How can I book a bus ticket on Malenadu Travels?",
      a: "Simply enter your boarding location (city, town, village, airport) and destination in the search box on our home page. Select your journey date, pick your preferred bus (KSRTC or Private Volvo), choose your seats, enter passenger details, and pay securely via UPI, Card, or NetBanking."
    },
    {
      q: "Can I book buses to small villages and rural hoblis in Karnataka?",
      a: "Yes! Malenadu Travels supports complete state coverage across all 31 districts, including taluk bus stands, village panchayat stops, and pilgrimage shrines."
    },
    {
      q: "What is the cancellation and refund policy?",
      a: "Cancellations made 24 hours prior to departure receive a 100% instant refund directly back to your original payment method or Malenadu E-Wallet."
    },
    {
      q: "How do I track my bus location live?",
      a: "Click on 'Live Track' in the top navigation bar or enter your PNR number in the Live Tracking page to view GPS location, current speed, and exact ETA."
    },
    {
      q: "Are Senior Citizen and Student discounts available?",
      a: "Yes, senior citizens (above 60 years) get 15% instant discount, and students with valid college ID cards get 10% cashback."
    }
  ];

  const faqsKn = [
    {
      q: "ಮಲೆನಾಡು ಟ್ರಾವೆಲ್ಸ್‌ನಲ್ಲಿ ಬಸ್ ಟಿಕೆಟ್ ಕಾಯ್ದಿರಿಸುವುದು ಹೇಗೆ?",
      a: "ನಮ್ಮ ಮುಖಪುಟದಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಯಾಣದ ಮೂಲ ನಗರ ಮತ್ತು ತಲುಪಬೇಕಾದ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ. ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ, ನಿಮ್ಮ ನೆಚ್ಚಿನ ಬಸ್ ಹಾಗೂ ಆಸನಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ, ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ ಯುಪಿಐ ಅಥವಾ ಕಾರ್ಡ್ ಮೂಲಕ ಸುಲಭವಾಗಿ ಪಾವತಿಸಿ."
    },
    {
      q: "ಕರ್ನಾಟಕದ ಸಣ್ಣ ಹಳ್ಳಿಗಳಿಗೆ ಮತ್ತು ಗ್ರಾಮಗಳಿಗೆ ಬಸ್‌ಗಳನ್ನು ಬುಕ್ ಮಾಡಬಹುದೇ?",
      a: "ಹೌದು! ಮಲೆನಾಡು ಟ್ರಾವೆಲ್ಸ್ ಕರ್ನಾಟಕದ ೩೧ ಜಿಲ್ಲೆಗಳು, ತಾಲೂಕು ಕೇಂದ್ರಗಳು ಹಾಗೂ ಪ್ರಮುಖ ಗ್ರಾಮೀಣ ರಸ್ತೆಗಳ ಸಂಪೂರ್ಣ ಬಸ್ ಸೇವೆಯನ್ನು ಒದಗಿಸುತ್ತದೆ."
    },
    {
      q: "ಟಿಕೆಟ್ ರದ್ದತಿ ಮತ್ತು ಹಣ ಮರುಪಾವತಿ ನೀತಿ ಏನು?",
      a: "ಪ್ರಯಾಣದ ಸಮಯಕ್ಕೆ ೨೪ ಗಂಟೆಗಳ ಮೊದಲು ಟಿಕೆಟ್ ರದ್ದುಗೊಳಿಸಿದರೆ ೧೦೦% ಹಣವು ತಕ್ಷಣವೇ ನಿಮ್ಮ ಖಾತೆಗೆ ಮರುಪಾವತಿಯಾಗುತ್ತದೆ."
    },
    {
      q: "ನನ್ನ ಬಸ್‌ನ ಲೈವ್ ಲೊಕೇಶನ್ ಟ್ರ್ಯಾಕ್ ಮಾಡುವುದು ಹೇಗೆ?",
      a: "ಮೇಲಿನ ನ್ಯಾವಿಗೇಶನ್‌ನಲ್ಲಿರುವ 'ಲೈವ್ ಟ್ರ್ಯಾಕ್' ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ನಿಮ್ಮ PNR ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ ಬಸ್‌ನ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಮತ್ತು ತಲುಪುವ ಸಮಯವನ್ನು ವೀಕ್ಷಿಸಿ."
    },
    {
      q: "ಹಿರಿಯ ನಾಗರಿಕರು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ರಿಯಾಯಿತಿ ಲಭ್ಯವಿದೆಯೇ?",
      a: "ಹೌದು, ೬೦ ವರ್ಷ ಮೀರಿದ ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ೧೫% ತತ್ಕ್ಷಣದ ರಿಯಾಯಿತಿ ಹಾಗೂ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ೧೦% ರಿಯಾಯಿತಿ ಲಭ್ಯವಿದೆ."
    }
  ];

  const faqs = language === 'kn' ? faqsKn : faqsEn;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-700 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-2">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{language === 'kn' ? '೨೪x೭ ಗ್ರಾಹಕ ನೆರವು' : '24x7 Customer Support'}</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">
          {language === 'kn' ? 'ಇಂದು ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' : 'How Can We Help You Today?'}
        </h2>
        <p className="text-xs font-black text-slate-600 dark:text-slate-400 mt-1">
          {language === 'kn' ? 'ಉಚಿತ ಕರ್ನಾಟಕ ಸಹಾಯವಾಣಿ: ೧೮೦೦-೪೨೫-೯೯೯೯' : 'Toll-Free Karnataka Helpline: 1800-425-9999'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FAQs */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-black text-lg text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{language === 'kn' ? 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು (FAQ)' : 'Frequently Asked Questions'}</span>
          </h3>

          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-black text-sm text-slate-900 dark:text-slate-100 flex justify-between items-center"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 24x7 Live Chat Assistant */}
        <div className="lg:col-span-5">
          <LiveChatAssistant />
        </div>

      </div>

    </div>
  );
}
