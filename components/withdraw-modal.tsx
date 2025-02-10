"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { translations } from "@/utils/translations"
import type { WithdrawModalProps } from "@/app/types/app"

export function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {translations.insufficientFunds?.ru || "Недостаточно средств"}
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}