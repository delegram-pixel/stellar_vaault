// components/ActionMenu.tsx
import React from 'react';
import { MoreVertical, Eye, User, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionMenuProps {
  onApprove: () => void;
  onReject: () => void;
  status: string;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onApprove, onReject, status }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>User Profile</span>
        </DropdownMenuItem>
        {status.toLowerCase() === 'pending' && (
          <>
            <DropdownMenuItem onClick={onApprove}>
              <Check className="mr-2 h-4 w-4" />
              <span>Approve</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onReject}>
              <X className="mr-2 h-4 w-4" />
              <span>Reject</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionMenu;