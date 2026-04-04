"use client"

import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <section className="bg-[#F5F5F2] py-24 md:py-28 px-6 md:px-8">
      <div className="max-w-[1200px] mx-auto">

        {/* Heading */}
        <div className="text-center mb-20">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-wide text-[#0B332E] mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            We’d love to hear from you. Reach out and our team will respond within 24 hours.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* LEFT - FORM */}
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-10">

            <div className="space-y-7">

              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#D9A441]/40 focus:border-[#D9A441]"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#D9A441]/40 focus:border-[#D9A441]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#D9A441]/40 focus:border-[#D9A441]"
                  placeholder="Order Inquiry"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#D9A441]/40 focus:border-[#D9A441]"
                  placeholder="Write your message..."
                />
              </div>

              <button className="bg-[#D9A441] text-black px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition w-full">
                Send Message
              </button>

            </div>
          </div>

          {/* RIGHT - CONTACT INFO */}
          <div className="bg-[#0B332E] text-[#F5F5F2] rounded-2xl p-8 md:p-10 shadow-xl">

            <h2 className="text-xl font-semibold mb-10 tracking-wide">
              Get in Touch
            </h2>

            <div className="space-y-8 text-sm">

              <div className="flex items-start gap-4">
                <Mail size={18} className="text-[#D9A441] mt-1" />
                <div>
                  <p className="text-[#DDE8E5]/70 text-xs uppercase tracking-widest mb-1">
                    Email
                  </p>
                  <p className="text-[#F5F5F2]">
                    mdafjalali222@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone size={18} className="text-[#D9A441] mt-1" />
                <div>
                  <p className="text-[#DDE8E5]/70 text-xs uppercase tracking-widest mb-1">
                    Phone
                  </p>
                  <p className="text-[#F5F5F2]">
                    +91 8448904039
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-[#D9A441] mt-1" />
                <div>
                  <p className="text-[#DDE8E5]/70 text-xs uppercase tracking-widest mb-1">
                    Location
                  </p>
                  <p className="text-[#F5F5F2]">
                    Alpha 1, Greater Noida, UP, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock size={18} className="text-[#D9A441] mt-1" />
                <div>
                  <p className="text-[#DDE8E5]/70 text-xs uppercase tracking-widest mb-1">
                    Support Hours
                  </p>
                  <p className="text-[#F5F5F2]">
                    Mon – Sat | 8 AM – 11 PM
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}