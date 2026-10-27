import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import ImpactStats from '../components/landing/ImpactStats';
import CommunityGlobeNetwork from '../components/3d/CommunityGlobeNetwork';
import FeaturedDonations from '../components/landing/FeaturedDonations';
import HowItWorks from '../components/landing/HowItWorks';
import ImpactCalculator from '../components/landing/ImpactCalculator';
import StakeholderBenefits from '../components/landing/StakeholderBenefits';
import FoodSafetyNotice from '../components/landing/FoodSafetyNotice';
import Testimonials from '../components/landing/Testimonials';

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* 1. Hero Section with 3D Food Bowl */}
      <HeroSection />

      {/* 2. Live Impact Stats */}
      <ImpactStats />

      {/* 3. 3D Community Network & Autonomous Matching Grid */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CommunityGlobeNetwork />
      </section>

      {/* 4. Featured Available Donations */}
      <FeaturedDonations />

      {/* 5. How ShareBite Works (3-step operational flow) */}
      <HowItWorks />

      {/* 6. Interactive Impact & Tax Deduction Calculator */}
      <ImpactCalculator />

      {/* 7. Donor & NGO Benefits */}
      <StakeholderBenefits />

      {/* 8. Food Safety & Legal Responsibility Notice */}
      <FoodSafetyNotice />

      {/* 9. Chef & Shelter Testimonials */}
      <Testimonials />
    </div>
  );
};

export default LandingPage;
