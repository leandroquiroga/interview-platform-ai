import React from 'react';
import { Separator } from '@/components/ui/separator';
import ListItems from './ListItems';
import { items } from '@/utils/functions';

const SideBarItems = () => {
  return (
    <div>
      {items.map(item => (
        <div key={item.name} className="flex flex-col items-start gap-2">
          <ListItems icon={item.icon} href={item.link} label={item.name} />
          <Separator className="my-2" />
        </div>
      ))}
    </div>
  );
};

export default SideBarItems;
