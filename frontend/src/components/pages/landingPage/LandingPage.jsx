import React from "react";

import { motion } from "framer-motion";
import { Utensils, BarChart3, ClipboardList, Users } from "lucide-react";
import Navbar from "../../navbar/Navbar";
import Footer from "../../footer/Footer";
import LandingBtn from "../../ui/buttons/landingBtn";

// ================= COLOR SYSTEM =================
export const COLORS = {
  primary: "bg-orange-500",
  primaryText: "text-orange-500",
  secondary: "bg-gray-900",
  light: "bg-gray-50",
  darkText: "text-gray-800",
  mutedText: "text-gray-500",
};

export default function LandingPage() {
  return (
    <div className={`min-h-screen ${COLORS.light} ${COLORS.darkText}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold mb-6"
        >
          Smart Restaurant Management System
        </motion.h2>
        <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-600">
          Manage orders, track inventory, analyze sales, and streamline your
          restaurant operations — all in one powerful platform.
        </p>
        <div className="space-x-4">
          <LandingBtn
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Start Free Trial
          </LandingBtn>
          <LandingBtn size="lg" variant="outline">
            Live Demo
          </LandingBtn>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-4 gap-6 px-10 py-16">
        {[
          {
            icon: <ClipboardList className="w-8 h-8 text-orange-500" />,
            title: "Order Management",
            desc: "Handle dine-in, takeaway, and delivery orders efficiently.",
          },
          {
            icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
            title: "Analytics",
            desc: "Get real-time insights into sales and performance.",
          },
          {
            icon: <Utensils className="w-8 h-8 text-orange-500" />,
            title: "Menu Control",
            desc: "Easily update menu items, pricing, and availability.",
          },
          {
            icon: <Users className="w-8 h-8 text-orange-500" />,
            title: "Staff Management",
            desc: "Manage staff roles, shifts, and permissions.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="rounded-2xl shadow-md hover:shadow-xl transition p-6 text-center bg-white">
              <div className="p-6 text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 bg-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Restaurant?
        </h2>
        <p className="mb-6 text-gray-600">
          Join hundreds of restaurants using RestoManage to grow their business.
        </p>
        <LandingBtn className="px-6 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition">
          Get Started
        </LandingBtn>
      </section>

      <Footer />
    </div>
  );
}
