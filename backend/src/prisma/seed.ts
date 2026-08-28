import { PrismaClient, FamilyRole, AccessStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting VAARIS Demo Seed...');

  const demoEmail = 'demo@vaaris.com';
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create or Find Demo User
  let user = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: demoEmail,
        fullName: 'Arjun Sharma',
        phoneNumber: '+919876543210',
        passwordHash,
        isEmailVerified: true,
      },
    });
    console.log(`Created demo user: ${demoEmail}`);
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, fullName: 'Arjun Sharma' },
    });
  }

  // 2. Check if Family already exists
  const familyAccess = await prisma.familyAccess.findFirst({
    where: { userId: user.id, role: FamilyRole.PRIMARY_ADMIN },
    include: { family: true },
  });

  let familyId: string;

  if (!familyAccess) {
    const family = await prisma.family.create({
      data: {
        name: 'Sharma Family Estate',
        createdById: user.id,
      },
    });
    familyId = family.id;

    // Create Access & Member
    await prisma.familyAccess.create({
      data: {
        familyId,
        userId: user.id,
        role: FamilyRole.PRIMARY_ADMIN,
        status: AccessStatus.ACTIVE,
      },
    });

    console.log(`Created demo family: ${family.name} (${familyId})`);
  } else {
    familyId = familyAccess.familyId;
  }

  // 3. Populate Family Members
  const existingMembers = await prisma.familyMember.findMany({ where: { familyId } });
  if (existingMembers.length === 0) {
    await prisma.familyMember.createMany({
      data: [
        {
          familyId,
          userId: user.id,
          name: 'Arjun Sharma',
          relationship: 'Self',
          age: 42,
          role: FamilyRole.PRIMARY_ADMIN,
          phone: '+91 98765 43210',
          email: 'demo@vaaris.com',
          isEmergencyContact: false,
          isPrimaryContact: true,
        },
        {
          familyId,
          name: 'Ananya Sharma',
          relationship: 'Spouse',
          age: 40,
          role: FamilyRole.DECISION_MAKER,
          phone: '+91 98765 43211',
          email: 'ananya@sharmafamily.in',
          isEmergencyContact: true,
          isPrimaryContact: false,
        },
        {
          familyId,
          name: 'Rohan Sharma',
          relationship: 'Son',
          age: 16,
          role: FamilyRole.VIEWER,
          phone: '+91 98765 43212',
          email: 'rohan@sharmafamily.in',
          isEmergencyContact: false,
          isPrimaryContact: false,
        },
        {
          familyId,
          name: 'Kavita Sharma',
          relationship: 'Mother',
          age: 68,
          role: FamilyRole.VIEWER,
          phone: '+91 98765 43213',
          email: 'kavita@sharmafamily.in',
          isEmergencyContact: false,
          isPrimaryContact: false,
        },
      ],
    });
    console.log('Created family members');
  }

  // 4. Populate Financial Records & Nominees
  const existingRecords = await prisma.financialRecord.findMany({ where: { familyId } });
  if (existingRecords.length === 0) {
    const r1 = await prisma.financialRecord.create({
      data: {
        familyId,
        name: 'HDFC Salary & Savings',
        category: 'bank_accounts',
        institution: 'HDFC Bank',
        accountNumberMasked: '•••• 4821',
        value: 450000,
        nomineeStatus: 'Verified',
        source: 'Document verified',
        notes: 'Primary household emergency fund and salary account.',
        nominees: {
          create: [{ name: 'Ananya Sharma', relationship: 'Spouse', sharePercentage: 100 }],
        },
      },
    });

    await prisma.financialRecord.create({
      data: {
        familyId,
        name: 'SBI Cumulative Fixed Deposit',
        category: 'fixed_deposits',
        institution: 'State Bank of India',
        accountNumberMasked: '•••• 9104',
        value: 1200000,
        nomineeStatus: 'Verified',
        source: 'Document verified',
        notes: 'Maturity: Oct 2027. Designated for higher education continuity.',
        nominees: {
          create: [{ name: 'Ananya Sharma', relationship: 'Spouse', sharePercentage: 100 }],
        },
      },
    });

    await prisma.financialRecord.create({
      data: {
        familyId,
        name: 'Zerodha Index & Direct Equities',
        category: 'stocks_investments',
        institution: 'Zerodha Broking',
        accountNumberMasked: '•••• 6632',
        value: 2850000,
        nomineeStatus: 'Verified',
        source: 'Document verified',
        notes: 'Nifty 50 & Midcap 150 index portfolio.',
        nominees: {
          create: [
            { name: 'Ananya Sharma', relationship: 'Spouse', sharePercentage: 70 },
            { name: 'Rohan Sharma', relationship: 'Son', sharePercentage: 30 },
          ],
        },
      },
    });

    const r4 = await prisma.financialRecord.create({
      data: {
        familyId,
        name: 'Max Life Term Insurance Plan',
        category: 'insurance',
        institution: 'Max Life Insurance',
        accountNumberMasked: '•••• 8829',
        value: 0,
        isInsurance: true,
        insuranceCoverage: 10000000,
        nomineeStatus: 'Verified',
        source: 'Document verified',
        notes: 'Term plan valid until age 75. Sum Assured: ₹1.00 Crore.',
        nominees: {
          create: [{ name: 'Ananya Sharma', relationship: 'Spouse', sharePercentage: 100 }],
        },
      },
    });

    const r5 = await prisma.financialRecord.create({
      data: {
        familyId,
        name: 'Residential Apartment - Kharadi Pune',
        category: 'property',
        institution: 'Sub-Registrar Pune',
        accountNumberMasked: 'Reg #4912',
        value: 12500000,
        nomineeStatus: 'Action Required',
        source: 'User provided',
        notes: 'Self-occupied family home. Society nomination form submitted, formal Will pending.',
        actionRequired: 'Register formal testamentary Will / society succession documentation',
      },
    });

    await prisma.financialRecord.create({
      data: {
        familyId,
        name: 'HDFC Home Loan Outstanding',
        category: 'loans_liabilities',
        institution: 'HDFC Ltd',
        accountNumberMasked: '•••• 1120',
        value: -3200000,
        nomineeStatus: 'Not Added',
        source: 'Document verified',
        notes: 'Protected under Max Life loan cover policy.',
      },
    });

    console.log('Created financial records and nominees');

    // 5. Populate Vault Documents
    await prisma.vaultDocument.createMany({
      data: [
        {
          familyId,
          name: 'Max Life Policy Schedule - ML-99824.pdf',
          category: 'Insurance',
          linkedAssetId: r4.id,
          linkedAssetName: r4.name,
          fileSizeBytes: 2450000,
          status: 'Document Processed',
          extractedData: { policyNumber: 'ML-99824', sumAssured: '₹1,00,00,000', nominee: 'Ananya Sharma' },
        },
        {
          familyId,
          name: 'Pune Apartment Registered Sale Deed.pdf',
          category: 'Property',
          linkedAssetId: r5.id,
          linkedAssetName: r5.name,
          fileSizeBytes: 8900000,
          status: 'Document Processed',
          extractedData: { registrationNo: '4912/2021', propertyType: 'Residential', owner: 'Arjun Sharma' },
        },
        {
          familyId,
          name: 'HDFC Savings Passbook & KYC.pdf',
          category: 'Financial Documents',
          linkedAssetId: r1.id,
          linkedAssetName: r1.name,
          fileSizeBytes: 1200000,
          status: 'Document Processed',
        },
      ],
    });
    console.log('Created vault documents');
  }

  // 6. Populate Continuity Plan
  const plan = await prisma.continuityPlan.findUnique({ where: { familyId } });
  if (!plan) {
    await prisma.continuityPlan.create({
      data: {
        familyId,
        completionPercentage: 80,
        emergencyContacts: {
          primary: { name: 'Ananya Sharma', role: 'Spouse & Nominee', phone: '+91 98765 43211' },
          secondary: { name: 'Vikram Sharma', role: 'Brother / Trustee', phone: '+91 98765 43212' },
          ca: { name: 'R. K. Agrawal & Co.', firm: 'Chartered Accountants', phone: '+91 98111 22334' },
        },
        responsibilities: {
          immediateFinances: 'Ananya Sharma (Spouse)',
          coordinateCA: 'Vikram Sharma (Brother)',
          overseeBusiness: 'Ananya Sharma + Family Advisor',
        },
        financialIntents: [
          {
            assetName: 'HDFC Savings & SBI FDs',
            category: 'Banking',
            notes: 'To be utilized for immediate household continuity and children education fund.',
            preferredAllocations: [{ name: 'Ananya Sharma', percentage: 100 }],
          },
          {
            assetName: 'Max Life Term Insurance (₹1.00 Cr)',
            category: 'Insurance',
            notes: 'Primary claim payout to clear outstanding liabilities and secure long-term family index investments.',
            preferredAllocations: [{ name: 'Ananya Sharma', percentage: 100 }],
          },
        ],
        instructions: [
          {
            id: 'ins-1',
            title: 'Immediate Access to Bank Locker',
            text: 'Locker key #44 is stored in the master bedroom safe (code in physical password book). Both Ananya and Vikram are authorized joint operators.',
            priority: 'High',
            targetContact: 'Ananya Sharma',
          },
          {
            id: 'ins-2',
            title: 'Health Insurance Claim Protocol',
            text: 'HDFC ERGO TPA Card is in the top right drawer. Inform insurance desk within 24 hours of hospital admission.',
            priority: 'High',
            targetContact: 'Vikram Sharma',
          },
        ],
        emergencyAccessTiers: [
          {
            contactName: 'Ananya Sharma',
            relationship: 'Spouse',
            accessLevel: 'Full Emergency Access',
            permissions: ['View all assets', 'Access Vault documents', 'Initiate claim guidance'],
            restrictionNotice: 'Activated instantly upon biometric or 2-factor OTP verification.',
          },
          {
            contactName: 'Vikram Sharma',
            relationship: 'Brother',
            accessLevel: 'Continuity Trustee',
            permissions: ['View business assets', 'Access tax filings & CA records'],
            restrictionNotice: 'Requires primary contact confirmation or 48-hour inactivity fail-safe.',
          },
        ],
      },
    });
    console.log('Created continuity plan');
  }

  // 7. Populate Emergency Case and Claim
  const existingCases = await prisma.emergencyCase.findMany({ where: { familyId } });
  if (existingCases.length === 0) {
    const eCase = await prisma.emergencyCase.create({
      data: {
        familyId,
        deceasedName: 'Suresh Sharma',
        relationship: 'Father',
        status: 'Active',
        knownAssetsValue: 3500000,
        milestones: [
          { id: 1, title: 'Death Intimation & Scope', status: 'Complete', detail: 'Family verified and estate scope locked.' },
          { id: 2, title: 'Document Verification', status: 'In Progress', detail: 'Death Certificate received; Legal Heir Certificate in progress.' },
          { id: 3, title: 'Claim Filing & Submissions', status: 'In Progress', detail: 'LIC Policy and SBI Savings claim forms submitted.' },
          { id: 4, title: 'Final Settlement', status: 'Pending', detail: 'Direct payout to legal nominees.' },
        ],
      },
    });

    await prisma.claim.create({
      data: {
        caseId: eCase.id,
        familyId,
        institution: 'Life Insurance Corporation of India (LIC)',
        assetType: 'insurance',
        assetName: 'LIC Jeevan Anand (Policy #519827)',
        claimantName: 'Arjun Sharma (Nominee)',
        estimatedAmount: 2500000,
        isInsurance: true,
        status: 'Documents Submitted',
        progressPercentage: 55,
        nextStep: 'Submit attested death certificate copy to LIC Pune Branch #812',
        steps: [
          { id: 'cs-1', stepNumber: 1, title: 'Policyholder Death Intimation', status: 'Complete', notes: 'Intimated online via portal reference #INT-88491' },
          { id: 'cs-2', stepNumber: 2, title: 'Claim Form A & Form B Submission', status: 'Complete', notes: 'Submitted along with PAN & Aadhaar' },
          { id: 'cs-3', stepNumber: 3, title: 'Attested Death Certificate Submission', status: 'Action Required', requiredDocument: 'Original Death Certificate' },
          { id: 'cs-4', stepNumber: 4, title: 'Insurer Assessment & Audit', status: 'Pending' },
          { id: 'cs-5', stepNumber: 5, title: 'Bank Account Payout', status: 'Pending' },
        ],
        missingDocumentNotice: {
          missingDocName: 'Original Death Certificate (Municipal Corporation)',
          reason: 'Insurer requires 2 notarized true copies for claims above ₹10 Lakhs.',
          whyItMatters: 'Mandatory statutory requirement under IRDAI guidelines.',
          suggestedAction: 'Collect certified copies from Pune Municipal Ward Office #4.',
        },
        activityLog: [
          { timestamp: 'Yesterday, 4:15 PM', author: 'Arjun Sharma', message: 'Submitted Form A and Form B with KYC documents.' },
          { timestamp: '2 days ago, 11:00 AM', author: 'VAARIS Claim Engine', message: 'Automated claim guide initialized for LIC Jeevan Anand.' },
        ],
      },
    });
    console.log('Created emergency case & claim');
  }

  console.log('🎉 VAARIS Demo Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
