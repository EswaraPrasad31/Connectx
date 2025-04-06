import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/use-auth';

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-xs mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Log Out?</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to log out?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2">
          <AlertDialogAction 
            onClick={handleLogout}
            className="w-full border border-gray-200 dark:border-gray-700 text-red-500 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Log Out
          </AlertDialogAction>
          <AlertDialogCancel 
            className="w-full mt-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
