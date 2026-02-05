import HeroBanner from '@/components/sections/HeroBanner';
import GoldCalculator from '@/components/sections/Calculator';
import ProcessSteps from '@/components/sections/ProcessSteps';
import Eligibility from '@/components/sections/Eligibility';
import Benefits from '@/components/sections/Benefits';
import PersonalLoanBanner from '@/components/sections/PersonalLoanABanner';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <GoldCalculator />
      <ProcessSteps />
      <Eligibility />
      <PersonalLoanBanner/>
      <Benefits />
    </>
  );
}