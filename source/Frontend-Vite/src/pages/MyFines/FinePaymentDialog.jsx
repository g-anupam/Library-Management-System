import React, { useState, useEffect } from "react";
import { getTypeChip } from "./getTypeChip";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Payment } from "@mui/icons-material";

const FinePaymentDialog = ({
  paymentDialog,
  setPaymentDialog,
  confirmPayment,
}) => {
  const [paymentMode, setPaymentMode] = useState("full");
  const [partialAmount, setPartialAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  const fine = paymentDialog.fine;
  const outstanding = fine ? parseFloat(fine.amountOutstanding) : 0;

  useEffect(() => {
    if (paymentDialog.open) {
      setPaymentMode("full");
      setPartialAmount("");
      setAmountError("");
    }
  }, [paymentDialog.open]);

  const handleModeChange = (_, newMode) => {
    if (newMode) {
      setPaymentMode(newMode);
      setPartialAmount("");
      setAmountError("");
    }
  };

  const handlePartialAmountChange = (e) => {
    const val = e.target.value;
    setPartialAmount(val);
    const num = parseFloat(val);
    if (!val || isNaN(num) || num <= 0) {
      setAmountError("Enter a valid amount");
    } else if (num > outstanding) {
      setAmountError(`Cannot exceed outstanding balance ($${outstanding.toFixed(2)})`);
    } else {
      setAmountError("");
    }
  };

  const handleConfirm = () => {
    if (paymentMode === "partial") {
      const num = parseFloat(partialAmount);
      if (!partialAmount || isNaN(num) || num <= 0 || num > outstanding) return;
      confirmPayment(paymentMode, Math.round(num));
    } else {
      confirmPayment(paymentMode, null);
    }
  };

  const isConfirmDisabled =
    paymentMode === "partial" &&
    (!partialAmount || !!amountError);

  return (
    <Dialog
      open={paymentDialog.open}
      onClose={() => setPaymentDialog({ open: false, fine: null })}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Payment color="error" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Pay Fine
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {fine && (
          <Box sx={{ mt: 1 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              You are about to pay the fine for{" "}
              <strong>{fine.bookTitle || "Fine #" + fine.id}</strong>
            </Alert>

            <Paper
              sx={{ p: 3, bgcolor: "#FEF2F2", border: "1px solid #FCA5A5", mb: 3 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Outstanding Balance:
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#DC2626" }}
                >
                  ${outstanding.toFixed(2)}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Fine Type:
                </Typography>
                {getTypeChip(fine.type)}
              </Box>
              {fine.reason && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Reason:</strong> {fine.reason}
                  </Typography>
                </Box>
              )}
            </Paper>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Payment Amount
              </Typography>
              <ToggleButtonGroup
                value={paymentMode}
                exclusive
                onChange={handleModeChange}
                size="small"
                fullWidth
              >
                <ToggleButton value="full">
                  Pay Full (${outstanding.toFixed(2)})
                </ToggleButton>
                <ToggleButton value="partial">Pay Partial Amount</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {paymentMode === "partial" && (
              <TextField
                label="Amount to Pay"
                type="number"
                value={partialAmount}
                onChange={handlePartialAmountChange}
                error={!!amountError}
                helperText={amountError || `Max: $${outstanding.toFixed(2)}`}
                inputProps={{ min: 0.01, max: outstanding, step: 0.01 }}
                fullWidth
                autoFocus
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <Typography sx={{ mr: 0.5, color: "text.secondary" }}>$</Typography>
                  ),
                }}
              />
            )}

            <Alert severity="warning">
              Payment will be processed securely. This action cannot be undone.
            </Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={() => setPaymentDialog({ open: false, fine: null })}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          startIcon={<Payment />}
          sx={{ px: 3, fontWeight: 600 }}
          disabled={isConfirmDisabled}
        >
          {paymentMode === "partial" && partialAmount && !amountError
            ? `Pay $${parseFloat(partialAmount).toFixed(2)}`
            : "Confirm Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FinePaymentDialog;
