import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import SecurityIcon from '@mui/icons-material/Security'
import CancelIcon from '@mui/icons-material/Cancel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { get2FA_QRCodeAPI, setup2FA_API } from '~/apis'

function Setup2FA({ isOpen, toggleOpen, user, handleSuccessSetup2FA }) {
  const [otpToken, setConfirmOtpToken] = useState('')
  const [error, setError] = useState(null)
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState(null)

  useEffect(() => {
    if (isOpen) {
      get2FA_QRCodeAPI(user._id).then(res => {
        setQrCodeImageUrl(res.qrcode)
      })
    }
  }, [isOpen, user._id])

  const handleCloseModal = () => {
    toggleOpen(!isOpen)
  }

  const handleConfirmSetup2FA = () => {
    if (!otpToken) {
      const errMsg = 'Please enter your otp token.'
      setError(errMsg)
      toast.error(errMsg)
      return
    }

    setup2FA_API(user._id, otpToken).then(updatedUser => {
      handleSuccessSetup2FA(updatedUser)
      toast.success('2FA setup successfully!')
      setError(null)
    })
  }

  return (
    <Modal
      disableScrollLock
      open={isOpen}
      // Use onClose in case you want to close the Modal by pressing the ESC button or clicking outside the Modal
      onClose={handleCloseModal} 
      sx={{ overflowY: 'auto' }}>
      <Box sx={{
        position: 'relative',
        maxWidth: 700,
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '40px 20px 20px',
        margin: '120px auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <SecurityIcon sx={{ color: '#27ae60' }} />
          <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#27ae60' }}>Setup 2FA (Two-Factor Authentication)</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, p: 1 }}>
          {!qrCodeImageUrl
            ? <span>Loading...</span>
            : <img
              style={{ width: '100%', maxWidth: '250px', objectFit: 'contain' }}
              src={qrCodeImageUrl}
              alt="2FA qrcode"
            />
          }

          <Box sx={{ textAlign: 'center' }}>
            Scan the QR code with your <strong>Google Authenticator</strong> or <strong>Authy</strong> app.<br />Then enter the 6-digit code and click <strong>Confirm</strong> to verify.
          </Box>

          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, my: 1 }}>
            <TextField
              autoFocus
              autoComplete='nope'
              label="Enter your code..."
              type="text"
              variant="outlined"
              sx={{ minWidth: '280px' }}
              value={otpToken}
              onChange={(e) => setConfirmOtpToken(e.target.value)}
              error={!!error && !otpToken}
            />

            <Button
              type="button"
              variant="contained"
              color="primary"
              size='large'
              sx={{ textTransform: 'none', minWidth: '120px', height: '55px', fontSize: '1em' }}
              onClick={handleConfirmSetup2FA}
            >
              Confirm
            </Button>
          </Box>

          <Box>
            <Typography variant="span" sx={{ fontWeight: 'bold', fontSize: '0.9em', color: '#8395a7', '&:hover': { color: '#fdba26' } }}>
              <a style={{ color: 'inherit', textDecoration: 'none' }} href='https://github.com/trander-25' target='_blank' rel='noreferrer'>
                Trander
              </a>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default Setup2FA
