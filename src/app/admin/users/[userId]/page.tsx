import UserDetails from '@/components/admin/users/Details';
import { getUserDetails } from '@/lib/queries';
import React from 'react';

type Props = {
  params: { userId: string };
};

const Page = async ({ params }: Props) => {
  const userId = params.userId;
  const user = await getUserDetails(userId);

  if (!user) {
    return {
      notFound: true,
    };
  }

  return (
    <div>
      <UserDetails user={user} />
    </div>
  );
};

export default Page;
