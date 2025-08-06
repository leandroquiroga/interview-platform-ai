import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth, useProfile } from '@/hooks';
import SideBarItems from './SideBar';

const MenuBar = () => {
  const { handleSignOut } = useAuth('sign-in');
  const { user } = useProfile();

  const handleLogout = async () => {
    await handleSignOut();
  };
  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Menu className="cursor-pointer" size={30} />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-lg">Hello! {user?.name} 🖐️</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col justify-between p-2 gap-4 h-lvh">
            <SideBarItems />
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MenuBar;
