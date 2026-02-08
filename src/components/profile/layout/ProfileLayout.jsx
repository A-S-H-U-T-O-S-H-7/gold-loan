import Header from './ProfileHeader';
import PersonalInfo from '../sections/PersonalInfo';
import StatusTimeline from '../sections/StatusTimeline';
import QuickActions from '../sections/QuickActions';
import LoanCard from '../sections/LoanCard';
import LoanHistory from '../sections/LoanHistory';
import ReferEarn from '../sections/ReferEarn';
import Footer from '@/components/layout/Footer';

export default function ProfilePage() {
  return (
    <>

      <Header/>

      <div className="space-y-4 py-2 md:py-6 px-2 md:px-6 bg-linear-to-br from-amber-100 via-amber-50 to-amber-200 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <PersonalInfo/>
            <QuickActions />
          </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <StatusTimeline/>
           
          <LoanHistory />
            <ReferEarn />
          </div>
        </div>

        

          <div className="lg:col-span-2">
            
          </div>
          <div>
            
          </div>
          </div>

        
      </div>
      <Footer/>
      </>
  );
}
