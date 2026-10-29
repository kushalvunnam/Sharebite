import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeaturedDonations from '../components/landing/FeaturedDonations';
import HowItWorks from '../components/landing/HowItWorks';
import CommunityGlobeNetwork from '../components/3d/CommunityGlobeNetwork';
import ImpactCalculator from '../components/landing/ImpactCalculator';
import StakeholderBenefits from '../components/landing/StakeholderBenefits';
import FoodSafetyNotice from '../components/landing/FoodSafetyNotice';
import Testimonials from '../components/landing/Testimonials';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* 1. Hero Section: Headline, 2 CTAs, Single Appetizing Image, 2 Floating Cards, Compact Impact Row */}
      <HeroSection />

      {/* 2. Immediately Below the Fold: Fresh food, ready to be shared (3 Attractive Cards + View All link) */}
      <FeaturedDonations />

      {/* 3. Followed by: Visually polished 3-step How ShareBite Works */}
      <HowItWorks />

      {/* 4. Autonomous Redistribution Network & Coverage */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CommunityGlobeNetwork />
      </section>

      {/* 5. Interactive Environmental & Tax Deduction Calculator */}
      <ImpactCalculator />

      {/* 6. Donor & NGO Stakeholder Benefits */}
      <StakeholderBenefits />

      {/* 7. Food Safety & Bill Emerson Good Samaritan Protection */}
      <FoodSafetyNotice />

      {/* 8. Chef & Shelter Testimonials */}
      <Testimonials />
    </div>
  );
};

export default LandingPage;
