
import React from 'react';
import StatsCards from './StatsCards';
import SubscriptionCard from './SubscriptionCard';

interface OverviewTabProps {
  credits: number;
  mockupsCount: number;
  subscription_tier: string;
  subscription_end: string | null;
  subscribed: boolean;
  subscriptionLoading: boolean;
  onRefreshSubscription: () => void;
  onManageSubscription: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  credits,
  mockupsCount,
  subscription_tier,
  subscription_end,
  subscribed,
  subscriptionLoading,
  onRefreshSubscription,
  onManageSubscription
}) => {
  return (
    <div className="space-y-6">
      <StatsCards
        credits={credits}
        mockupsCount={mockupsCount}
        subscription_tier={subscription_tier}
        subscription_end={subscription_end}
        subscribed={subscribed}
      />
      
      <SubscriptionCard
        subscribed={subscribed}
        subscription_tier={subscription_tier}
        subscription_end={subscription_end}
        subscriptionLoading={subscriptionLoading}
        onRefreshSubscription={onRefreshSubscription}
        onManageSubscription={onManageSubscription}
      />
    </div>
  );
};

export default OverviewTab;
