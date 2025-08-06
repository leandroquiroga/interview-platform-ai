import { ListItemsProps } from '@/types';
import Link from 'next/link';
import React from 'react';

const ListItems = ({ icon: Icon, href, label }: ListItemsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Icon className="text-gray-500" size={20} />
      <Link href={href} className="text-gray-200">
        {label}
      </Link>
    </div>
  );
};

export default ListItems;
