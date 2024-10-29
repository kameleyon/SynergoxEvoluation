import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  Alert,
  Grid,
} from '@mui/material';
import {
  CreditCard,
  Building,
  Receipt,
  HelpCircle,
  Download,
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ padding: '24px 0' }}>
    {value === index && children}
  </div>
);

// Common styles
const textStyles = {
  color: 'var(--text-color)'
};

const buttonStyles = {
  color: 'var(--text-color)',
  borderColor: 'var(--text-color)',
  '&:hover': {
    borderColor: 'var(--text-color)',
    opacity: 0.8,
  }
};

const PlanCard = ({ title, price, features, buttonText, isCurrentPlan }) => (
  <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#151e29' }}>
    <Typography variant="h5" gutterBottom sx={textStyles}>{title}</Typography>
    <Typography variant="h4" sx={{ ...textStyles, mb: 2 }}>${price}/month</Typography>
    <Box sx={{ flexGrow: 1 }}>
      {features.map((feature, index) => (
        <Typography key={index} sx={{ ...textStyles, mb: 1 }}>• {feature}</Typography>
      ))}
    </Box>
    <Button 
      variant={isCurrentPlan ? "outlined" : "contained"}
      disabled={isCurrentPlan}
      sx={isCurrentPlan ? buttonStyles : { bgcolor: '#88ab75', color: 'var(--text-color)' }}
    >
      {buttonText}
    </Button>
  </Paper>
);

const Billing = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [activeTab, setActiveTab] = useState(0);

  if (!clerkLoaded) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="info">Loading billing information...</Alert>
      </Box>
    );
  }

  if (!clerkUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Please sign in to view billing information.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }} className="billing-container">
      <Typography variant="h4" gutterBottom sx={{ mb: 4, ...textStyles }}>
        Billing & Subscription
      </Typography>

      <Paper sx={{ width: '100%', mb: 3, bgcolor: '#151e29' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, val) => setActiveTab(val)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              color: 'var(--text-color)',
              opacity: 0.7,
              '&.Mui-selected': {
                color: 'var(--text-color)',
                opacity: 1,
              },
            },
          }}
        >
          <Tab icon={<Building size={20} style={{ color: 'var(--text-color)' }} />} label="PLAN DETAILS" />
          <Tab icon={<CreditCard size={20} style={{ color: 'var(--text-color)' }} />} label="PAYMENT METHODS" />
          <Tab icon={<Receipt size={20} style={{ color: 'var(--text-color)' }} />} label="BILLING HISTORY" />
          <Tab icon={<HelpCircle size={20} style={{ color: 'var(--text-color)' }} />} label="SUPPORT" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <Typography variant="h6" gutterBottom sx={textStyles}>Current Plan Status</Typography>
            <Paper sx={{ p: 3, mb: 4, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={textStyles}>Pro Plan</Typography>
                  <Typography variant="body2" sx={textStyles}>
                    Renews on October 31, 2023
                  </Typography>
                  <Typography variant="body2" sx={{ ...textStyles, opacity: 0.7 }}>
                    Using 80% of plan capacity
                  </Typography>
                </Box>
                <Button 
                  variant="contained"
                  sx={{ bgcolor: '#88ab75', color: 'var(--text-color)' }}
                >
                  MANAGE PLAN
                </Button>
              </Box>
            </Paper>

            <Typography variant="h6" gutterBottom sx={textStyles}>Available Plans</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <PlanCard
                  title="Free"
                  price="0"
                  features={[
                    '5 projects',
                    'Basic support',
                    'Community access'
                  ]}
                  buttonText="SELECT PLAN"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PlanCard
                  title="Pro"
                  price="19"
                  features={[
                    'Unlimited projects',
                    'Priority support',
                    'Advanced features'
                  ]}
                  buttonText="CURRENT PLAN"
                  isCurrentPlan={true}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PlanCard
                  title="Enterprise"
                  price="Custom"
                  features={[
                    'Custom solutions',
                    '24/7 support',
                    'Dedicated manager'
                  ]}
                  buttonText="SELECT PLAN"
                />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" gutterBottom sx={textStyles}>Payment Methods</Typography>
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CreditCard size={24} style={{ color: 'var(--text-color)' }} />
                  <Box>
                    <Typography sx={textStyles}>•••• •••• •••• 4242</Typography>
                    <Typography variant="body2" sx={{ ...textStyles, opacity: 0.7 }}>
                      Expires 12/24
                    </Typography>
                  </Box>
                </Box>
                <Button variant="contained" sx={{ bgcolor: '#88ab75', color: 'var(--text-color)' }}>
                  UPDATE CARD
                </Button>
              </Box>
            </Paper>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CreditCard size={20} style={{ color: 'var(--text-color)' }} />}
              sx={buttonStyles}
            >
              ADD NEW PAYMENT METHOD
            </Button>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom sx={textStyles}>Billing History</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={textStyles}>Date</TableCell>
                    <TableCell sx={textStyles}>Amount</TableCell>
                    <TableCell sx={textStyles}>Status</TableCell>
                    <TableCell sx={textStyles}>Invoice</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { date: '2023-10-01', amount: 19.00 },
                    { date: '2023-09-01', amount: 19.00 },
                    { date: '2023-08-01', amount: 19.00 },
                  ].map((invoice) => (
                    <TableRow key={invoice.date}>
                      <TableCell sx={textStyles}>{invoice.date}</TableCell>
                      <TableCell sx={textStyles}>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label="Paid"
                          size="small"
                          sx={{ bgcolor: 'rgba(56, 157, 81, 0.2)', color: '#88ab75' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          startIcon={<Download size={16} style={{ color: 'var(--text-color)' }} />}
                          sx={buttonStyles}
                        >
                          DOWNLOAD
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom sx={textStyles}>Billing Support</Typography>
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="h6" gutterBottom sx={textStyles}>
                Need Help?
              </Typography>
              <Typography sx={{ ...textStyles, opacity: 0.7, mb: 3 }}>
                Our support team is available 24/7 to help you with any billing questions or concerns.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#88ab75', color: 'var(--text-color)' }}
                >
                  CONTACT SUPPORT
                </Button>
                <Button
                  variant="outlined"
                  sx={buttonStyles}
                >
                  VIEW FAQ
                </Button>
              </Box>
            </Paper>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default Billing;