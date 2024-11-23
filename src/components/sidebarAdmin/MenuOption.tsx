"use client"

import React, { useEffect, useMemo, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Compass, Menu } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { icons } from "@/lib/constant";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

type Props = {
  defaultOpen?: boolean;
};

const MenuOptions = ({ defaultOpen }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  const sidebarOptions = [
    { id: 1, name: 'Dashboard', icon: 'home', link: '/admin/dashboard' },
    { id: 2, name: 'Transaction', icon: 'receipt', link: '/admin/transaction' },
    { id: 4, name: 'Our Plans', icon: 'payment', link: '/admin/plans' },
    { id: 5, name: 'Deposit', icon: 'wallet', link: '/admin/deposit' },
    { id: 6, name: 'Withdraw', icon: 'send', link: '/admin/withdraw' },
    { id: 6, name: 'Manage Users', icon: 'send', link: '/admin/users' },
    { id: 7, name: 'Payment Setting', icon: 'person', link: '/admin/profile' },
    { id: 7, name: 'Kyc Approval', icon: 'info', link: '/admin/verify' },
    { id: 9, name: 'Settings', icon: 'settings', link: '/admin/settings' },
  ];

  return (
    <Sheet modal={false} {...openState}>
      <SheetTrigger
        asChild
        className="absolute left-4 top-4 z-[100] md:!hidden flex"
      >
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        showX={!defaultOpen}
        side="left"
        className={clsx(
          'bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6',
          {
            'hidden md:inline-block z-0 w-[300px]': defaultOpen,
            'inline-block md:hidden z-[100] w-full': !defaultOpen,
          }
        )}
      >
        <div>
          <div className="flex items-center gap-2 my-4">
            <Compass />
            <h1 className="font-bold">Sphera Vault.</h1>
          </div>

          <p className="text-muted-foreground text-xs mb-2">MENU LINKS</p>
          <Separator className="mb-4" />
          <nav className="relative">
            <Command className="rounded-lg overflow-visible bg-transparent">
              <CommandInput placeholder="Search..." />
              <CommandList className="py-4 overflow-visible">
                <CommandEmpty>No Results Found</CommandEmpty>
                <CommandGroup className="overflow-visible">
                  {sidebarOptions.map((option) => {
                    let val;
                    const result = icons.find(
                      (icon) => icon.value === option.icon
                    );
                    if (result) {
                      val = <result.path />;
                    }
                    return (
                      <CommandItem
                        key={option.id}
                        className="md:w-[320px] w-full"
                      >
                        <SheetClose asChild>
                          <Link
                            href={option.link}
                            className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all md:w-full w-[320px]"
                          >
                            {val}
                            <span>{option.name}</span>
                          </Link>
                        </SheetClose>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;