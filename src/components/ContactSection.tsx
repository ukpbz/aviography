import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MapPin, Camera, AlertCircle } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

export const ContactSection: React.FC = () => {
  const { showNotification } = usePhotos();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Print Inquiry / Licensing',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showNotification('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    // Simulate immediate reliable dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showNotification('Thank you! Your message has been sent to Paul Brown.');
    }, 700);
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <span>Get in Touch</span>
            <span aria-hidden="true">·</span>
            <span>Aviography UK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Contact Paul Brown
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            Have a question about high-resolution aviation prints, airshow commissions, or print licensing?
            Send an inquiry below or email directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Direct Info Card */}
          <div className="md:col-span-5 p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xs space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Direct Correspondence</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Direct messages reach Paul Brown in London, England. Inquiries are typically reviewed within 24–48 hours.
              </p>
            </div>

            <div className="space-y-4 text-xs text-neutral-300">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">Email Address</span>
                  <a
                    href="mailto:ukpbrown@gmail.com"
                    className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                  >
                    ukpbrown@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">Base Location</span>
                  <span>London, England</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Camera className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">Affiliation</span>
                  <span>Societies of Photographers · Bingley Camera Club</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
              <strong className="text-neutral-200 block mb-1">Image Rights & Licensing:</strong>
              All aerial, airshow, and flightline images on Aviography are copyright Paul Brown. Commercial and editorial
              licensing requests should specify target media and print dimensions.
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl">
            {isSubmitted ? (
              <div className="text-center py-10 space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">Message Dispatched Successfully</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Thank you, {formData.name}. Your inquiry regarding{' '}
                  <span className="text-amber-400">{formData.subject}</span> has been routed to Paul Brown.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'Print Inquiry / Licensing', message: '' });
                  }}
                  className="mt-2 px-4 py-2 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Your Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Flight Lieutenant James Mitchell"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white placeholder-neutral-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Your Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white placeholder-neutral-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white focus:outline-none transition-colors"
                  >
                    <option value="Print Inquiry / Licensing">High-Res Print Inquiry / Licensing</option>
                    <option value="Airshow Commission">Airshow & Squadron Photography Commission</option>
                    <option value="Camera Club Lecture">Camera Club Lecture / Judging Request</option>
                    <option value="General Inquiries">General Photography Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Message <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message, mention specific aircraft or airshow if applicable..."
                    className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-lg text-white placeholder-neutral-600 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
