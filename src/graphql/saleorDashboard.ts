import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
}

export interface ActiveSubstance {
  activeSubstanceDose?: Maybe<Scalars["Int"]>;
  activeSubstanceDoseInWords?: Maybe<Array<Scalars["String"]>>;
  activeSubstanceDoseUnit?: Maybe<Scalars["String"]>;
}

export interface ActiveSubstanceOfDrug {
  unitCode?: Maybe<Scalars["String"]>;
  amountPerItem?: Maybe<Scalars["String"]>;
  amountPerPackage?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  substanceId?: Maybe<Scalars["String"]>;
}

export enum AdditionalRefundRight {
  IB = "IB",
  IW = "IW",
  ZK = "ZK",
  PO = "PO",
  AZ = "AZ",
  CN = "CN",
  DN = "DN",
  IN = "IN",
  BW = "BW",
  WP = "WP",
  S = "S",
}

export interface Address {
  country?: Maybe<Scalars["String"]>;
  city: Scalars["String"];
  street: Scalars["String"];
  zipCode: Scalars["String"];
  houseNumber: Scalars["String"];
  flatNumber?: Maybe<Scalars["String"]>;
  location?: Maybe<Location>;
  notes?: Maybe<Scalars["String"]>;
  apiDump?: Maybe<Scalars["String"]>;
}

export type Analysis = BaseVital &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: VitalType;
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    messageId: Scalars["String"];
    visitId: Scalars["String"];
    measured?: Maybe<Time>;
    delivered?: Maybe<Time>;
    overrideFiles?: Maybe<Array<Scalars["String"]>>;
    customDate?: Maybe<Time>;
    analysisType: Scalars["String"];
    params: BloodParam[];
    group?: Maybe<Scalars["String"]>;
    patient?: Maybe<Patient>;
    doctor?: Maybe<Doctor>;
    message?: Maybe<Message>;
    visit?: Maybe<Visit>;
  };

export interface AnalyticsData {
  source: RegistrationSource;
  data: Scalars["JSON"];
}

export interface Answer {
  choice_id: Scalars["String"];
  id: Scalars["String"];
  source: Scalars["String"];
  initial: Scalars["Boolean"];
}

export enum AppointmentStatus {
  EMPTY = "EMPTY",
  INDETERMINATE = "INDETERMINATE",
  CONFIRMED = "CONFIRMED",
}

export type Assignment = BaseMessage &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: MessageType;
    stripeSessionId: Scalars["String"];
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    visitId: Scalars["String"];
    data?: Maybe<Scalars["JSON"]>;
    assignmentType: Scalars["String"];
    positions?: Maybe<Array<Maybe<Position>>>;
    makerId?: Maybe<Scalars["String"]>;
    status?: Maybe<AssignmentStatus>;
    signatureFile?: Maybe<Scalars["String"]>;
    paid?: Maybe<Scalars["Boolean"]>;
    invoiceId?: Maybe<Scalars["String"]>;
    plannedStart?: Maybe<Time>;
    plannedPlace?: Maybe<Scalars["String"]>;
    duration?: Maybe<Scalars["Int"]>;
    vitals: VitalEntity[];
    maker: Doctor;
    doctor: Doctor;
    patient: Patient;
    visit: Visit;
  };

export interface AssignmentEntity {
  id: Scalars["Float"];
  name: Scalars["String"];
  foreignServiceId: Scalars["String"];
  nfzPossible: Scalars["Boolean"];
  entrustedBudgetPriceInDecimal?: Maybe<Scalars["Float"]>;
  icd9?: Maybe<Scalars["String"]>;
  color?: Maybe<Scalars["String"]>;
  material?: Maybe<Scalars["String"]>;
  type: AssignmentType;
}

export enum AssignmentStatus {
  NOT_DONE = "NOT_DONE",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  RESULTS = "RESULTS",
}

export enum AssignmentType {
  IMAGE = "IMAGE",
  LABORATORY = "LABORATORY",
  QUICKTEST = "QUICKTEST",
  IMMUNIZATION = "IMMUNIZATION",
  OTHER = "OTHER",
}

export interface BaseMessage {
  createdAt: Time;
  updatedAt: Time;
  id: Scalars["String"];
  type: MessageType;
  stripeSessionId: Scalars["String"];
  patientId: Scalars["String"];
  doctorId: Scalars["String"];
  visitId: Scalars["String"];
}

export interface BaseUser {
  createdAt: Time;
  updatedAt: Time;
  id: Scalars["String"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  pesel?: Maybe<Scalars["String"]>;
  genre: UserGenre;
  phone: Scalars["String"];
  email?: Maybe<Scalars["String"]>;
  passwordHash: Scalars["String"];
  lastLogin: Time;
  avatar?: Maybe<Scalars["String"]>;
  consultantInfo: Scalars["JSON"];
  realNFZStatus: RealNFZStatusType;
}

export interface BaseVital {
  createdAt: Time;
  updatedAt: Time;
  id: Scalars["String"];
  type: VitalType;
  patientId: Scalars["String"];
  doctorId: Scalars["String"];
  messageId: Scalars["String"];
  visitId: Scalars["String"];
  measured?: Maybe<Time>;
  delivered?: Maybe<Time>;
  overrideFiles?: Maybe<Array<Scalars["String"]>>;
  customDate?: Maybe<Time>;
}

export interface BloodParam {
  name?: Maybe<Scalars["String"]>;
  value?: Maybe<Scalars["String"]>;
  unit?: Maybe<Scalars["String"]>;
  min?: Maybe<Scalars["String"]>;
  max?: Maybe<Scalars["String"]>;
  text?: Maybe<Scalars["String"]>;
}

export interface ChangePasswordInput {
  currentPassword: Scalars["String"];
  newPassword: Scalars["String"];
}

export interface ChatMessageCreatedEvent {
  message: ChatMessageEntity;
}

export interface ChatMessageDeletedEvent {
  message: ChatMessageEntity;
}

export interface ChatMessageEntity {
  id: Scalars["String"];
  content: Scalars["String"];
  authorId?: Maybe<Scalars["String"]>;
  authorType: Scalars["String"];
  patientId: Scalars["String"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  deletedAt?: Maybe<Scalars["DateTime"]>;
  visit?: Maybe<Visit>;
  prescription?: Maybe<Prescription>;
  assignment?: Maybe<Assignment>;
  leave?: Maybe<Leave>;
  referral?: Maybe<Referral>;
  testimonial?: Maybe<Testimonial>;
  survey?: Maybe<SurveyProposalEntity>;
  author?: Maybe<User>;
  patient: Patient;
}

export interface ChatMessageInput {
  content: Scalars["String"];
}

export type ChatMessagesUpdateEvent =
  | ChatMessageCreatedEvent
  | ChatMessageDeletedEvent
  | PrescriptionChatMessageDeletedEvent;

export interface Checker {
  id: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
}

export interface ClientAppSettings {
  preferredLocation: Scalars["String"];
}

export interface Clinic {
  id: Scalars["Int"];
  name: Scalars["String"];
  type: Scalars["Int"];
}

export interface ClinicDetails {
  name: Scalars["String"];
  code: Scalars["String"];
}

export interface ClinicInput {
  id: Scalars["Int"];
  name: Scalars["String"];
  type: Scalars["Int"];
}

export interface Codes {
  A: Scalars["Boolean"];
  B: Scalars["Boolean"];
  C: Scalars["Boolean"];
  D: Scalars["Boolean"];
  E: Scalars["Boolean"];
}

export interface CodesInput {
  A: Scalars["Boolean"];
  B: Scalars["Boolean"];
  C: Scalars["Boolean"];
  D: Scalars["Boolean"];
  E: Scalars["Boolean"];
}

export enum ConfirmationType {
  INTERVIEW = "INTERVIEW",
  DOCUMENTATION = "DOCUMENTATION",
  EXAMINATION = "EXAMINATION",
}

export interface ConnectionInput {
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  birthDate: Scalars["String"];
  type: Scalars["String"];
}

export interface CovidExaminationInput {
  visitId: Scalars["String"];
  financingSource: FinancingSource;
  notMobilePatient: Scalars["Boolean"];
}

export interface CreateDocumentInput {
  name: Scalars["String"];
  source: MedicalDocumentSource;
  fileId: Scalars["String"];
  patientId: Scalars["String"];
  createdAt: Scalars["String"];
  tagId?: InputMaybe<Scalars["String"]>;
}

export interface CreateProcedureInput {
  createdOnVisitId?: InputMaybe<Scalars["String"]>;
  type: ProcedureType;
  patientId: Scalars["String"];
}

export type Ct = BaseVital &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: VitalType;
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    messageId: Scalars["String"];
    visitId: Scalars["String"];
    measured?: Maybe<Time>;
    delivered?: Maybe<Time>;
    overrideFiles?: Maybe<Array<Scalars["String"]>>;
    customDate?: Maybe<Time>;
    patient?: Maybe<Patient>;
    doctor?: Maybe<Doctor>;
    message?: Maybe<Message>;
    visit?: Maybe<Visit>;
  };

export interface Declaration {
  type?: Maybe<DeclarationType>;
  genre?: Maybe<DeclarationGenre>;
  date: Scalars["String"];
  npwz?: Maybe<Scalars["String"]>;
  comment?: Maybe<Scalars["String"]>;
  patientData?: Maybe<PatientData>;
  files?: Maybe<Array<Scalars["String"]>>;
}

export type DeclarationAcceptedEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
};

export enum DeclarationGenre {
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
}

export type DeclarationNoLongerValidEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  reason: DeclarationNoLongerValidReason;
};

export type DeclarationNoLongerValidReason =
  | FacilityChangeEvent
  | IncorrectDeclarationEvent
  | PatientDiedEvent;

export type DeclarationRejectedEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  rejectionReason: DeclarationRejectionReason;
  exactRejectionReason: Scalars["String"];
  nfzComment: Scalars["String"];
};

export enum DeclarationRejectionReason {
  NOT_INSURED = "NOT_INSURED",
}

export enum DeclarationSource {
  APP = "APP",
  EPUAP = "EPUAP",
  PAPER = "PAPER",
  IKP = "IKP",
}

export type DeclarationSubmittedEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  source: DeclarationSource;
  date: Scalars["DateTime"];
  comment: Scalars["String"];
  files: Array<Scalars["String"]>;
};

export enum DeclarationType {
  PAPER = "PAPER",
  EPUAP = "EPUAP",
  IKP = "IKP",
  APP = "APP",
}

export interface Diag {
  id: Scalars["String"];
  name: Scalars["String"];
  price: Scalars["Float"];
  isAvailableAsNFZ: Scalars["Boolean"];
  type: Scalars["String"];
  comission?: Maybe<Scalars["String"]>;
  orgIds?: Maybe<Array<Scalars["String"]>>;
}

export type DiagOrPacket = Diag | DiagPacket;

export interface DiagPacket {
  name: Scalars["String"];
  price: Scalars["Float"];
  items: Diag[];
}

export interface Diagnosis {
  code?: Maybe<Scalars["String"]>;
  grade?: Maybe<DiagnosisGrade>;
}

export enum DiagnosisGrade {
  MAIN = "MAIN",
  SUPPLEMENTARY = "SUPPLEMENTARY",
}

export interface DiagnosisInput {
  code?: InputMaybe<Scalars["String"]>;
  grade?: InputMaybe<DiagnosisGrade>;
}

export type Doctor = BaseUser &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    firstName?: Maybe<Scalars["String"]>;
    lastName?: Maybe<Scalars["String"]>;
    pesel?: Maybe<Scalars["String"]>;
    genre: UserGenre;
    phone: Scalars["String"];
    email?: Maybe<Scalars["String"]>;
    passwordHash: Scalars["String"];
    lastLogin: Time;
    avatar: Scalars["String"];
    consultantInfo: Scalars["JSON"];
    realNFZStatus: RealNFZStatusType;
    npwz?: Maybe<Scalars["String"]>;
    about?: Maybe<Scalars["String"]>;
    signature?: Maybe<Scalars["String"]>;
    terms?: Maybe<Term[]>;
    hiddenSnippets?: Maybe<Array<Scalars["String"]>>;
    medicalPushToken?: Maybe<Scalars["JSON"]>;
    isDeclarable?: Maybe<Scalars["Boolean"]>;
    sipNumber?: Maybe<Scalars["String"]>;
    snippets?: Maybe<SnippetEntity[]>;
    hasPassword?: Maybe<Scalars["Boolean"]>;
    seenPosts: Array<Scalars["String"]>;
    intercomUserHash: Scalars["String"];
    referralCommissionSum: Scalars["Float"];
  };

export interface DoctorInput {
  zusPass?: InputMaybe<Scalars["String"]>;
  zusCert?: InputMaybe<Scalars["String"]>;
  signature?: InputMaybe<Scalars["String"]>;
  hiddenSnippets?: InputMaybe<Array<Scalars["String"]>>;
  medicalPushToken?: InputMaybe<Scalars["JSON"]>;
  password?: InputMaybe<Scalars["String"]>;
}

export interface DoctorInterval {
  min: Scalars["String"];
  max: Scalars["String"];
}

export interface Drug {
  drug: Scalars["String"];
  form: Scalars["String"];
  boxAmount?: Maybe<Scalars["Int"]>;
  drugAmount?: Maybe<Scalars["Float"]>;
  dose: Scalars["String"];
  interval?: Maybe<Scalars["String"]>;
  quantity?: Maybe<Scalars["String"]>;
  cost: Scalars["String"];
  ean?: Maybe<Scalars["String"]>;
  psychoSubstances?: Maybe<Scalars["Boolean"]>;
  activeSubstances?: Maybe<Array<Maybe<ActiveSubstance>>>;
  hourInterval?: Maybe<Scalars["Int"]>;
  morePatientInfo?: Maybe<Scalars["String"]>;
  morePharmacistInfo?: Maybe<Scalars["String"]>;
  recipeId?: Maybe<Scalars["Int"]>;
  quantityDescription?: Maybe<Scalars["String"]>;
  additionalPermission?: Maybe<Scalars["String"]>;
}

export interface DrugDetails {
  name: Scalars["String"];
  box: Scalars["String"];
  ean: Scalars["String"];
  form: Scalars["String"];
  dosage: Scalars["String"];
  pregnacyDetails: PregnacyDetails;
  dosageDescription?: Maybe<Scalars["String"]>;
  productCharacteristics?: Maybe<Scalars["String"]>;
  use?: Maybe<Scalars["String"]>;
  composition?: Maybe<Scalars["String"]>;
  effect?: Maybe<Scalars["String"]>;
  indications?: Maybe<Scalars["String"]>;
  contraindications?: Maybe<Scalars["String"]>;
  comments?: Maybe<Scalars["String"]>;
  precautions?: Maybe<Scalars["String"]>;
  interactions?: Maybe<Scalars["String"]>;
  pregnantWomenInstructions?: Maybe<Scalars["String"]>;
  hasPsychoSubstances: Scalars["Boolean"];
  isCustom: Scalars["Boolean"];
  activeSubstances: ActiveSubstanceOfDrug[];
  paymentLevels: PaymentDetails[];
  additionalRefunds: AdditionalRefundRight[];
}

export interface DrugMaterial {
  name: Scalars["String"];
  id: Scalars["String"];
  dose: Scalars["String"];
  doseInfo: Scalars["String"];
  unit: Scalars["String"];
  sort: Scalars["String"];
}

export interface DrugRecipe {
  id: Scalars["Int"];
  name: Scalars["String"];
  description: Scalars["String"];
  form: Scalars["String"];
  formDescription: Scalars["String"];
  dose: Scalars["String"];
  quantityDescription: Scalars["String"];
  materials: DrugMaterial[];
}

export interface DrugWithPackageInput {
  name: Scalars["String"];
  dose: Scalars["String"];
  form: Scalars["String"];
  box: Scalars["String"];
  ean: Scalars["String"];
  boxAmount: Scalars["Int"];
  psychoSubstances: Scalars["Boolean"];
  interval: Scalars["String"];
  payment: Scalars["String"];
  additionalRefundRight?: InputMaybe<AdditionalRefundRight>;
}

export interface DynamicPositionData {
  color: Scalars["String"];
  type: Scalars["String"];
  material: Scalars["String"];
}

export type Ekg = BaseVital &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: VitalType;
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    messageId: Scalars["String"];
    visitId: Scalars["String"];
    measured?: Maybe<Time>;
    delivered?: Maybe<Time>;
    overrideFiles?: Maybe<Array<Scalars["String"]>>;
    customDate?: Maybe<Time>;
    genre?: Maybe<Scalars["String"]>;
    file?: Maybe<Scalars["String"]>;
    comments?: Maybe<Scalars["String"]>;
    patient?: Maybe<Patient>;
    doctor?: Maybe<Doctor>;
    message?: Maybe<Message>;
    visit?: Maybe<Visit>;
  };

export interface EkgResults {
  link: Scalars["String"];
  date: Scalars["String"];
}

export interface EwusCheck {
  date: Scalars["String"];
  status: EwusCheckStatus;
  checker?: Maybe<Checker>;
}

export type EwusCheckEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  event: EwusEvent;
};

export enum EwusCheckStatus {
  INSURED = "INSURED",
  UNINSURED = "UNINSURED",
  SIGNED_TODAY = "SIGNED_TODAY",
}

export interface EwusCheckWithDate {
  date: Scalars["String"];
  status: NFZEventType;
}

export type EwusEvent = EwusGreenEvent | EwusRedEvent;

export type EwusGreenEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
};

export type EwusRedEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
};

export type ExactInsuranceStatus =
  | EwusCheckEvent
  | InsuranceContributionCertificateEvent
  | PatientInsuranceStatementEvent;

export type FacilityChangeEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  info: FacilityChangeInfo;
};

export type FacilityChangeInVoivodeshipEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  nfzComment: Scalars["String"];
};

export type FacilityChangeInfo =
  | FacilityChangeInVoivodeshipEvent
  | FacilityChangeOutsideVoivodeshipEvent;

export type FacilityChangeOutsideVoivodeshipEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  insuranceProviderInfo: Scalars["String"];
  insuranceProviderInfoUrl: Scalars["String"];
  nfzComment: Scalars["String"];
};

export enum FaqType {
  BLOOD = "BLOOD",
  URINE_CULTURE = "URINE_CULTURE",
  URINE_GENERAL = "URINE_GENERAL",
  OGTT = "OGTT",
  POO = "POO",
  EKG = "EKG",
  MEDICINE = "MEDICINE",
  VACCINE = "VACCINE",
  DRUGPASS = "DRUGPASS",
  SPIRO = "SPIRO",
  USG = "USG",
  RTG = "RTG",
  STANDARD = "STANDARD",
}

export enum FinancingSource {
  NFZ = "NFZ",
  public = "public",
  commercial = "commercial",
}

export interface ForceVisitInput {
  slotType: SlotType;
  plannedStart: Scalars["DateTime"];
  organizationId: Scalars["String"];
  duration: Scalars["Int"];
  doctorId: Scalars["String"];
  type?: InputMaybe<VisitType>;
}

export interface FreeTime {
  doctor: Doctor;
  time: Scalars["String"];
  place: Scalars["String"];
  location: Scalars["String"];
  slot_id: Scalars["Int"];
  organization_id?: Maybe<Scalars["String"]>;
}

export interface FullAddress {
  city: Scalars["String"];
  street: Scalars["String"];
  zipCode: Scalars["String"];
  houseNumber: Scalars["String"];
  latitude?: Maybe<Scalars["Float"]>;
  longitude?: Maybe<Scalars["Float"]>;
  teryt?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  municipality?: Maybe<Scalars["String"]>;
  flatNumber?: Maybe<Scalars["String"]>;
}

export interface Global {
  createdAt: Time;
  updatedAt: Time;
}

export type Heartrate = BaseVital &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: VitalType;
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    messageId: Scalars["String"];
    visitId: Scalars["String"];
    measured?: Maybe<Time>;
    delivered?: Maybe<Time>;
    overrideFiles?: Maybe<Array<Scalars["String"]>>;
    customDate?: Maybe<Time>;
    rate: Scalars["Int"];
    patient?: Maybe<Patient>;
    doctor?: Maybe<Doctor>;
    message?: Maybe<Message>;
    visit?: Maybe<Visit>;
  };

export interface History {
  userId: Scalars["String"];
  when: Time;
  change: Scalars["JSON"];
  user: User;
}

export interface ICD10Input {
  name: Scalars["String"];
  icd10: Scalars["String"];
}

export interface ICD10Main {
  name: Scalars["String"];
  icd10: Scalars["String"];
}

export interface ICD9Input {
  name: Scalars["String"];
  icd9: Scalars["String"];
}

export interface ICD9Main {
  name: Scalars["String"];
  icd9: Scalars["String"];
}

export type IncorrectDeclarationEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  reason: Scalars["String"];
};

export type Injection = BaseVital &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: VitalType;
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    messageId: Scalars["String"];
    visitId: Scalars["String"];
    measured?: Maybe<Time>;
    delivered?: Maybe<Time>;
    overrideFiles?: Maybe<Array<Scalars["String"]>>;
    customDate?: Maybe<Time>;
    patientSignatureAgreement: Scalars["String"];
    patientSignatureTransport: Scalars["String"];
    drugs: InjectionDrug[];
    portions: Scalars["String"];
    comments?: Maybe<Scalars["String"]>;
    closed: Scalars["Boolean"];
    injectionType: InjectionType;
    patient?: Maybe<Patient>;
    doctor?: Maybe<Doctor>;
    message?: Maybe<Message>;
    visit?: Maybe<Visit>;
  };

export interface InjectionDrug {
  name: Scalars["String"];
  series: Scalars["String"];
  date: Scalars["String"];
}

export enum InjectionType {
  VACCINE = "VACCINE",
  MEDICINE = "MEDICINE",
}

export type InsuranceContributionCertificateEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
};

export interface InsuranceStatementData {
  patientStatement?: InputMaybe<PatientInsuranceStatementData>;
  representativeStatement?: InputMaybe<RepresentativeInsuranceStatementData>;
}

export enum InsuranceStatementPatientReason {
  OBJECIE_UBEZPIECZENIEM_ZDROWOTNYM_W_RZECZYPOSPOLITEJ_POLSKIEJ = "OBJECIE_UBEZPIECZENIEM_ZDROWOTNYM_W_RZECZYPOSPOLITEJ_POLSKIEJ",
  ART_54_UST_1 = "ART_54_UST_1",
  ART_2_UST_1_PKT_4_LIT_A = "ART_2_UST_1_PKT_4_LIT_A",
  ART_2_UST_1_PKT_4_LIT_B = "ART_2_UST_1_PKT_4_LIT_B",
  ART_67_UST_4_7 = "ART_67_UST_4_7",
  UA = "UA",
}

export enum InsuranceStatementRepresentativeReason {
  OBJECIE_UBEZPIECZENIEM_ZDROWOTNYM_W_RZECZYPOSPOLITEJ_POLSKIEJ = "OBJECIE_UBEZPIECZENIEM_ZDROWOTNYM_W_RZECZYPOSPOLITEJ_POLSKIEJ",
  ART_54_UST_1 = "ART_54_UST_1",
  ART_2_UST_1_PKT_4_LIT_A = "ART_2_UST_1_PKT_4_LIT_A",
  ART_2_UST_1_PKT_4_LIT_B = "ART_2_UST_1_PKT_4_LIT_B",
  ART_67_UST_4_7 = "ART_67_UST_4_7",
  ART_2_UST_1_PKT_3_LIT_A = "ART_2_UST_1_PKT_3_LIT_A",
  ART_2_UST_1_PKT_3_LIT_B = "ART_2_UST_1_PKT_3_LIT_B",
  ART_2_UST_1_PKT_3_LIT_C = "ART_2_UST_1_PKT_3_LIT_C",
  UA = "UA",
}

export type InsuranceStatusEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  status: ExactInsuranceStatus;
};

export interface IssuePrescriptionInput {
  visitId: Scalars["String"];
  useSince: Scalars["String"];
  in365days: Scalars["Boolean"];
  insuredIn: StateInsurance;
  drugs: DrugWithPackageInput[];
}

export interface IssuePrescriptionWithOperationResult {
  prescriptions: PrescriptionResult[];
  operationIsSafe: Scalars["Boolean"];
}

export interface IssueReferralInput {
  visitId: Scalars["String"];
  referralType: Scalars["String"];
  icd10: ICD10Input;
  icd9?: InputMaybe<ICD9Input>;
  comment?: InputMaybe<Scalars["String"]>;
  adviceGoal?: InputMaybe<Scalars["String"]>;
  clinic: ClinicInput;
  nfzDepartment?: InputMaybe<NfzDepartmentInput>;
  examinationType?: InputMaybe<Scalars["String"]>;
  urgent: Scalars["Boolean"];
  insuredIn?: InputMaybe<StateInsurance>;
}

export interface KeyValue {
  key: Scalars["String"];
  value: Scalars["String"];
}

export enum LabExaminationPayment {
  FREE = "FREE",
  UNPAID = "UNPAID",
  PAID = "PAID",
}

export interface LaboratoryExaminationCreationInput {
  patientId: Scalars["String"];
  cito: Scalars["Boolean"];
  serviceId: Scalars["String"];
  payment: LabExaminationPayment;
  createdOnVisitId?: InputMaybe<Scalars["String"]>;
}

export interface LaboratoryExaminationEntity {
  id: Scalars["String"];
  patientId: Scalars["String"];
  visitId?: Maybe<Scalars["String"]>;
  paymentId?: Maybe<Scalars["String"]>;
  createdOnVisitId?: Maybe<Scalars["String"]>;
  serviceId: Scalars["String"];
  sampleId?: Maybe<Scalars["String"]>;
  cito: Scalars["Boolean"];
  cancelled: Scalars["Boolean"];
  paidFromEntrustedBudget: Scalars["Boolean"];
  assignment: Scalars["JSON"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  diagIdPosition: Scalars["Float"];
  createdBy?: Maybe<Scalars["String"]>;
  payment: LabExaminationPayment;
  paidAt?: Maybe<Scalars["DateTime"]>;
  price: Scalars["String"];
  stripeSessionId?: Maybe<Scalars["String"]>;
  groupId?: Maybe<Scalars["String"]>;
  orderId?: Maybe<Scalars["String"]>;
  executionLimit: Scalars["String"];
  comment?: Maybe<Scalars["String"]>;
  patient: UserEntity;
  displayPayment: Scalars["String"];
  creator: User;
  diag: AssignmentEntity;
}

export interface LaboratoryExaminationUpdateDataInput {
  visitId?: InputMaybe<Scalars["String"]>;
  sampleId?: InputMaybe<Scalars["String"]>;
  cito?: InputMaybe<Scalars["Boolean"]>;
  cancelled?: InputMaybe<Scalars["Boolean"]>;
  payment?: InputMaybe<LabExaminationPayment>;
  groupId?: InputMaybe<Scalars["String"]>;
  comment?: InputMaybe<Scalars["String"]>;
}

export type Leave = BaseMessage &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: MessageType;
    stripeSessionId: Scalars["String"];
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    visitId: Scalars["String"];
    reason?: Maybe<Scalars["String"]>;
    leaveType?: Maybe<Scalars["String"]>;
    insuredIn?: Maybe<Scalars["String"]>;
    icd10Main: ICD10Main;
    inabilitySince?: Maybe<Scalars["String"]>;
    inabilityUntil?: Maybe<Scalars["String"]>;
    careSince?: Maybe<Scalars["String"]>;
    careUntil?: Maybe<Scalars["String"]>;
    doNotSendPayerInfo?: Maybe<Scalars["Boolean"]>;
    recommendation?: Maybe<Scalars["String"]>;
    codes?: Maybe<Codes>;
    payer?: Maybe<Payer>;
    underCarePerson?: Maybe<UnderCarePerson>;
    leaves?: Maybe<LeaveDetails[]>;
    doctor: Doctor;
    patient: Patient;
    visit: Visit;
  };

export interface LeaveDetails {
  seriesNumber: Scalars["String"];
  ids: Array<Scalars["String"]>;
  upo: Array<Scalars["String"]>;
}

export interface Location {
  latitude: Scalars["Float"];
  longtitude: Scalars["Float"];
}

export interface MeasurementInput {
  systolicPressure?: InputMaybe<Scalars["String"]>;
  diastolicPressure?: InputMaybe<Scalars["String"]>;
  pulse?: InputMaybe<Scalars["String"]>;
  resultType?: InputMaybe<Scalars["String"]>;
}

export enum MedicalDocumentSource {
  EMAIL = "EMAIL",
  DRIVE = "DRIVE",
  CHAT = "CHAT",
  EKG = "EKG",
}

export interface MedicalLeaveDetails {
  doNotSendPayerInfo: Scalars["Boolean"];
  inabilitySince: Scalars["String"];
  inabilityUntil: Scalars["String"];
  careSince: Scalars["String"];
  careUntil: Scalars["String"];
  recommendation: Scalars["String"];
  icd10: ICD10Main;
  code: Scalars["String"];
}

export interface MedicalLeaveInput {
  visitId: Scalars["String"];
  leaveType: Scalars["String"];
  icd10Main: ICD10Input;
  inabilitySince: Scalars["String"];
  inabilityUntil: Scalars["String"];
  careSince?: InputMaybe<Scalars["String"]>;
  careUntil?: InputMaybe<Scalars["String"]>;
  doNotSendPayerInfo: Scalars["Boolean"];
  recommendation: Scalars["String"];
  codes: CodesInput;
  payers: PayerInput[];
  address: StayAddressInput;
  underCarePerson?: InputMaybe<ConnectionInput>;
  reason?: InputMaybe<Scalars["String"]>;
  insuredIn?: InputMaybe<StateInsurance>;
}

export interface MedicalRecordEntity {
  id: Scalars["String"];
  name: Scalars["String"];
  createdAt: Scalars["DateTime"];
  archived: Scalars["Boolean"];
  tagId?: Maybe<Scalars["String"]>;
  starred: Scalars["Boolean"];
  source: MedicalDocumentSource;
  patientId: Scalars["String"];
  fileId: Scalars["String"];
}

export interface MedicineSubtitle {
  type: Scalars["String"];
  subtitle: Scalars["String"];
}

export type Message =
  | Assignment
  | Leave
  | Prescription
  | Referral
  | Testimonial;

export enum MessageType {
  PRESCRIPTION = "PRESCRIPTION",
  ASSIGNMENT = "ASSIGNMENT",
  LEAVE = "LEAVE",
  TESTIMONIAL = "TESTIMONIAL",
  REFERRAL = "REFERRAL",
}

export interface Mutation {
  createLaboratoryExaminations: LaboratoryExaminationEntity[];
  updateLaboratoryExaminations: Array<Scalars["String"]>;
  createProcedure: ProcedureEntity;
  updateProcedure: Scalars["String"];
  deleteChatMessage: Scalars["String"];
  updateVisitSlot: Visit;
  updateUserAddress: Patient;
  changePassword: Scalars["String"];
  unpinProcedure: ProcedureEntity;
  markPostsAsSeen: Array<Scalars["String"]>;
  createPatientTag: Scalars["String"];
  createPatient: Scalars["String"];
  sendRecommendation: ChatMessageEntity;
  getContentFromImage: Scalars["String"];
  saveHealthInsuranceStatement: Scalars["String"];
  createVital: Scalars["String"];
  updateVital: Scalars["String"];
  makeCall: Scalars["JSON"];
  createVisitSlot: Scalars["String"];
  createVisit: Scalars["String"];
  reopenVisit: Scalars["String"];
  startVisit: Visit;
  closeVisit: Visit;
  deleteVisit: Visit;
  patientLeftVisit: Visit;
  patientShowedUpForAVisit: Visit;
  waitingForPatient: Patient;
  unpinPatient: Patient;
  unpinAllPatients: Scalars["Int"];
  closePatient: Patient;
  forceVisit: Visit;
  forceCreateVisit: Visit;
  updateVisit: Scalars["String"];
  createAssignment: Scalars["String"];
  createChatMessage: Scalars["String"];
  updatePatient: Scalars["String"];
  updateMe: Scalars["String"];
  createSnippet: Snippet;
  updateSnippet: Snippet;
  deleteSnippet: Snippet;
  showSnippet: Doctor;
  deletePatientTag: Scalars["String"];
  updatePatientTag: Scalars["String"];
  createSurvey: Scalars["String"];
  issueMedicalLeave: Scalars["String"];
  issuePrescription: IssuePrescriptionWithOperationResult;
  createCovidExamination: Scalars["String"];
  issueReferral: Scalars["String"];
  generateTestimonial: Scalars["String"];
  deleteTestimonial: Scalars["String"];
  deletePrescription: Scalars["String"];
  deletePatient: Scalars["String"];
  revokeAssignment: Scalars["String"];
  createDocument: MedicalRecordEntity;
  archiveDocument: Scalars["String"];
  updateDocument: Scalars["String"];
  deleteVital: Scalars["String"];
  sendInvitationForVisit: Scalars["String"];
  refreshVaccinations: Scalars["String"];
  createNFZEvent: Scalars["String"];
  deleteNFZEvent: Scalars["String"];
  pushNFZStatusesToFirebase: Array<Scalars["String"]>;
  pushNFZStatusToFirebase: Scalars["String"];
}

export interface MutationcreateLaboratoryExaminationsArgs {
  data: LaboratoryExaminationCreationInput[];
}

export interface MutationupdateLaboratoryExaminationsArgs {
  data: LaboratoryExaminationUpdateDataInput;
  ids: Array<Scalars["String"]>;
}

export interface MutationcreateProcedureArgs {
  dataInput: ProcedureDataInput;
  data: CreateProcedureInput;
}

export interface MutationupdateProcedureArgs {
  dataInput?: InputMaybe<ProcedureDataInput>;
  data?: InputMaybe<UpdateProcedureInput>;
  procedureId: Scalars["String"];
}

export interface MutationdeleteChatMessageArgs {
  id: Scalars["String"];
}

export interface MutationupdateVisitSlotArgs {
  slotsInRow?: InputMaybe<Scalars["Float"]>;
  slotIds: Array<Scalars["Int"]>;
  id: Scalars["String"];
}

export interface MutationupdateUserAddressArgs {
  flatNumber?: InputMaybe<Scalars["String"]>;
  address: PlacematicAddressInput;
  id: Scalars["String"];
}

export interface MutationchangePasswordArgs {
  input: ChangePasswordInput;
}

export interface MutationunpinProcedureArgs {
  id: Scalars["String"];
}

export interface MutationmarkPostsAsSeenArgs {
  ids: Array<Scalars["String"]>;
}

export interface MutationcreatePatientTagArgs {
  fileIds?: InputMaybe<Array<Scalars["String"]>>;
  input: PatientTagInput;
}

export interface MutationcreatePatientArgs {
  lastName: Scalars["String"];
  firstName: Scalars["String"];
  pesel: Scalars["String"];
  phone: Scalars["String"];
}

export interface MutationsendRecommendationArgs {
  visitId: Scalars["String"];
}

export interface MutationgetContentFromImageArgs {
  input: OCRImageInput;
}

export interface MutationsaveHealthInsuranceStatementArgs {
  data: NFZEventData;
  organizationId: Scalars["String"];
  patientId: Scalars["String"];
}

export interface MutationcreateVitalArgs {
  specificInput: Scalars["JSON"];
  input: VitalInput;
}

export interface MutationupdateVitalArgs {
  specificInput: Scalars["JSON"];
  id: Scalars["String"];
}

export interface MutationmakeCallArgs {
  patientId: Scalars["String"];
}

export interface MutationcreateVisitSlotArgs {
  slotsInRow?: InputMaybe<Scalars["Float"]>;
  slotIds: Array<Scalars["Int"]>;
  patientId: Scalars["String"];
}

export interface MutationcreateVisitArgs {
  input: NewVisitInput;
}

export interface MutationreopenVisitArgs {
  id: Scalars["String"];
}

export interface MutationstartVisitArgs {
  id: Scalars["String"];
}

export interface MutationcloseVisitArgs {
  id: Scalars["String"];
}

export interface MutationdeleteVisitArgs {
  id: Scalars["String"];
}

export interface MutationpatientLeftVisitArgs {
  id: Scalars["String"];
}

export interface MutationpatientShowedUpForAVisitArgs {
  id: Scalars["String"];
}

export interface MutationwaitingForPatientArgs {
  id: Scalars["String"];
}

export interface MutationunpinPatientArgs {
  id: Scalars["String"];
}

export interface MutationclosePatientArgs {
  id: Scalars["String"];
}

export interface MutationforceVisitArgs {
  input: ForceVisitInput;
  id: Scalars["String"];
}

export interface MutationforceCreateVisitArgs {
  input: ForceVisitInput;
  patientId: Scalars["String"];
}

export interface MutationupdateVisitArgs {
  input: VisitInput;
  id: Scalars["String"];
}

export interface MutationcreateAssignmentArgs {
  input: PrescriptionInput;
}

export interface MutationcreateChatMessageArgs {
  isSystem?: InputMaybe<Scalars["Boolean"]>;
  input: ChatMessageInput;
  id: Scalars["String"];
}

export interface MutationupdatePatientArgs {
  input: PatientInput;
  id: Scalars["String"];
}

export interface MutationupdateMeArgs {
  input: DoctorInput;
  id: Scalars["String"];
}

export interface MutationcreateSnippetArgs {
  input: SnippetInput;
}

export interface MutationupdateSnippetArgs {
  input: SnippetInput;
  id: Scalars["String"];
}

export interface MutationdeleteSnippetArgs {
  id: Scalars["String"];
}

export interface MutationshowSnippetArgs {
  doctorId: Scalars["String"];
  id: Scalars["String"];
}

export interface MutationdeletePatientTagArgs {
  id: Scalars["String"];
}

export interface MutationupdatePatientTagArgs {
  fileIds?: InputMaybe<Array<Scalars["String"]>>;
  input: PatientTagInput;
  id: Scalars["String"];
}

export interface MutationcreateSurveyArgs {
  input: SurveyProposalInput;
}

export interface MutationissueMedicalLeaveArgs {
  input: MedicalLeaveInput;
  id: Scalars["String"];
}

export interface MutationissuePrescriptionArgs {
  input: IssuePrescriptionInput;
}

export interface MutationcreateCovidExaminationArgs {
  input: CovidExaminationInput;
}

export interface MutationissueReferralArgs {
  input: IssueReferralInput;
}

export interface MutationgenerateTestimonialArgs {
  input: TestimonialInput;
}

export interface MutationdeleteTestimonialArgs {
  id: Scalars["String"];
}

export interface MutationdeletePrescriptionArgs {
  prescriptionId: Scalars["String"];
}

export interface MutationdeletePatientArgs {
  phone: Scalars["String"];
}

export interface MutationrevokeAssignmentArgs {
  id: Scalars["String"];
}

export interface MutationcreateDocumentArgs {
  input: CreateDocumentInput;
}

export interface MutationarchiveDocumentArgs {
  id: Scalars["String"];
}

export interface MutationupdateDocumentArgs {
  input: UpdateDocumentInput;
  id: Scalars["String"];
}

export interface MutationdeleteVitalArgs {
  id: Scalars["String"];
}

export interface MutationsendInvitationForVisitArgs {
  type: VisitType;
  id: Scalars["String"];
}

export interface MutationrefreshVaccinationsArgs {
  patientId: Scalars["String"];
}

export interface MutationcreateNFZEventArgs {
  input: NFZEventInput;
}

export interface MutationdeleteNFZEventArgs {
  id: Scalars["String"];
}

export interface MutationpushNFZStatusToFirebaseArgs {
  id: Scalars["String"];
}

export interface NFZEventData {
  insuranceStatement?: InputMaybe<InsuranceStatementData>;
}

export interface NFZEventEntity {
  id: Scalars["String"];
  patientId: Scalars["String"];
  executionDate: Scalars["DateTime"];
  type: NFZEventType;
  organizationId: Scalars["String"];
  employeeId?: Maybe<Scalars["String"]>;
  data?: Maybe<Scalars["JSON"]>;
  employee?: Maybe<StaffEntity>;
}

export interface NFZEventInput {
  patientId: Scalars["String"];
  executionDate: Scalars["DateTime"];
  type: NFZEventType;
  organizationId: OrganizationIdVojevodship;
  data: Scalars["JSON"];
}

export enum NFZEventType {
  DEKLARACJA = "DEKLARACJA",
  OSWIADCZENIE = "OSWIADCZENIE",
  ZASWIADCZENIE_OD_PLATNIKA_SKLADEK = "ZASWIADCZENIE_OD_PLATNIKA_SKLADEK",
  NFZ_AKCEPTACJA = "NFZ_AKCEPTACJA",
  NFZ_ODRZUCENIE = "NFZ_ODRZUCENIE",
  EWUS_ZIELONY = "EWUS_ZIELONY",
  EWUS_CZERWONY = "EWUS_CZERWONY",
}

export interface NewVisitInput {
  patientId: Scalars["String"];
  type?: InputMaybe<VisitType>;
}

export interface NfzDepartmentInput {
  key: Scalars["String"];
  name: Scalars["String"];
}

export interface NfzEventBase {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
}

export type NfzHistoryEvent =
  | DeclarationAcceptedEvent
  | DeclarationNoLongerValidEvent
  | DeclarationRejectedEvent
  | DeclarationSubmittedEvent
  | InsuranceStatusEvent
  | UnknownEvent;

export interface OCRImageInput {
  imageId: Scalars["String"];
  top: Scalars["Float"];
  left: Scalars["Float"];
  bottom: Scalars["Float"];
  right: Scalars["Float"];
}

export interface ObjectedNFZStatus {
  declaredIn?: Maybe<Scalars["String"]>;
  wasDeclared: Scalars["Boolean"];
  canUsePublicVisits: Scalars["Boolean"];
  whereCanDeclare?: Maybe<Scalars["String"]>;
  canDeclare: Scalars["Boolean"];
  availablePublicPrivateShenanigans: Array<Scalars["String"]>;
  comment?: Maybe<Scalars["String"]>;
  textStatus?: Maybe<Scalars["String"]>;
  chosenDoctor?: Maybe<Scalars["String"]>;
  chosenNurse?: Maybe<Scalars["String"]>;
  telezgodaAccepted: Scalars["Boolean"];
  ewusLastCheck?: Maybe<EwusCheckWithDate>;
}

export interface OpeningHours {
  weekday: WeekDay;
  openingType: OpeningType;
  /** Present only if openingType === Hours */
  ranges?: Maybe<Range[]>;
}

export enum OpeningType {
  Hours = "Hours",
  OnlineOnly = "OnlineOnly",
  Unavailable = "Unavailable",
}

export type Operation = BaseVital &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: VitalType;
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    messageId: Scalars["String"];
    visitId: Scalars["String"];
    measured?: Maybe<Time>;
    delivered?: Maybe<Time>;
    overrideFiles?: Maybe<Array<Scalars["String"]>>;
    customDate?: Maybe<Time>;
    operationType: Scalars["String"];
    comments?: Maybe<Scalars["String"]>;
    materials: OperationMaterial[];
    patient?: Maybe<Patient>;
    doctor?: Maybe<Doctor>;
    message?: Maybe<Message>;
    visit?: Maybe<Visit>;
  };

export interface OperationMaterial {
  type: Scalars["String"];
  name: Scalars["String"];
  series: Scalars["String"];
  date: Scalars["String"];
  quantity: Scalars["Int"];
}

export enum Ordering {
  ASC = "ASC",
  DESC = "DESC",
}

export interface OrganizationEntity {
  id: Scalars["String"];
  name: Scalars["String"];
  displayName: Scalars["String"];
  placeData?: Maybe<PlaceData>;
}

export enum OrganizationIdVojevodship {
  PD = "PD",
  PC = "PC",
  PL = "PL",
  PF = "PF",
  PE = "PE",
  PK = "PK",
  PM = "PM",
  PO = "PO",
  PR = "PR",
  PB = "PB",
  PG = "PG",
  PS = "PS",
  PT = "PT",
  PN = "PN",
  PP = "PP",
  PZ = "PZ",
  PATIENT = "PATIENT",
}

export type Other = BaseVital &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: VitalType;
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    messageId: Scalars["String"];
    visitId: Scalars["String"];
    measured?: Maybe<Time>;
    delivered?: Maybe<Time>;
    overrideFiles?: Maybe<Array<Scalars["String"]>>;
    customDate?: Maybe<Time>;
    customName?: Maybe<Scalars["String"]>;
    customComment?: Maybe<Scalars["String"]>;
    group?: Maybe<Scalars["String"]>;
    patient?: Maybe<Patient>;
    doctor?: Maybe<Doctor>;
    message?: Maybe<Message>;
    visit?: Maybe<Visit>;
  };

export interface Package {
  ean: Scalars["String"];
  name: Scalars["String"];
  box: Scalars["String"];
  form: Scalars["String"];
  dosage: Scalars["String"];
}

export type Patient = BaseUser &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    firstName?: Maybe<Scalars["String"]>;
    lastName?: Maybe<Scalars["String"]>;
    pesel?: Maybe<Scalars["String"]>;
    genre: UserGenre;
    phone: Scalars["String"];
    email?: Maybe<Scalars["String"]>;
    passwordHash: Scalars["String"];
    lastLogin: Time;
    avatar: Scalars["String"];
    consultantInfo: Scalars["JSON"];
    realNFZStatus: RealNFZStatusType;
    remindMe: Scalars["String"];
    updatesToDo: Array<Scalars["String"]>;
    citizenship?: Maybe<Scalars["String"]>;
    passportNumber?: Maybe<Scalars["String"]>;
    passportCountry?: Maybe<Scalars["String"]>;
    chosenDoctor?: Maybe<Scalars["String"]>;
    chosenNurse?: Maybe<Scalars["String"]>;
    address?: Maybe<FullAddress>;
    deliveryAddress?: Maybe<Address>;
    survey?: Maybe<Survey>;
    representative: Array<Scalars["String"]>;
    secretData?: Maybe<SecretData>;
    patientCardNumber: Scalars["String"];
    signature: Scalars["String"];
    underCarePersons: UnderCarePerson[];
    statusUbezpieczenia?: Maybe<Scalars["Int"]>;
    izolacja?: Maybe<Scalars["String"]>;
    kwarantanna?: Maybe<Scalars["String"]>;
    stayAddresses: Address[];
    oneTimeSurvey?: Maybe<Scalars["JSON"]>;
    regularSurvey: Scalars["JSON"];
    relation: Scalars["String"];
    permission: Scalars["String"];
    nfzData: Scalars["JSON"];
    ewusCheckHistory: EwusCheck[];
    ekgResults: EkgResults[];
    uniqueIntegerId: Scalars["Int"];
    analyticsData: AnalyticsData;
    mobileAppVersion: Scalars["String"];
    lastPatientMessageBlock?: Maybe<Time>;
    oneTimeSurveyUpdatedAt?: Maybe<Time>;
    assistantId?: Maybe<Scalars["String"]>;
    registrationType: Scalars["JSON"];
    deviceInfo: Scalars["String"];
    files: Scalars["JSON"];
    patientPublicSince?: Maybe<Time>;
    unread: Scalars["Float"];
    hasPassword: Scalars["Boolean"];
    vitals: Vital[];
    messages: Message[];
    visits: Visit[];
    tags: PatientTag[];
    surveys: SurveyProposal[];
    canBeDeleted?: Maybe<Scalars["Boolean"]>;
    payers: Payer[];
    medicalLeaves: MedicalLeaveDetails[];
    actionRequired?: Maybe<Scalars["String"]>;
    clientAppSettings?: Maybe<ClientAppSettings>;
    nfzStatus: ObjectedNFZStatus;
    currentVirtualVisit?: Maybe<Visit>;
    lastChatMessage?: Maybe<ChatMessageEntity>;
    documents: MedicalRecordEntity[];
    getUnderCarePersons: UnderCarePerson[];
    notificationAgreements: UsersNotificationAgreementsEntity[];
    isPublic: Scalars["Boolean"];
  };

export interface PatientvisitsArgs {
  orderByCreationDate?: InputMaybe<Ordering>;
}

export interface PatientData {
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  pesel?: Maybe<Scalars["String"]>;
  patientCardNumber?: Maybe<Scalars["String"]>;
  address?: Maybe<Address>;
  email?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
}

export type PatientDeclarationHistoryEvent =
  | DeclarationSubmittedEvent
  | UnknownEvent;

export type PatientDiedEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
};

export interface PatientInput {
  secretData?: InputMaybe<SecretDataInput>;
  address?: InputMaybe<StayAddressInput>;
  firstName?: InputMaybe<Scalars["String"]>;
  lastName?: InputMaybe<Scalars["String"]>;
  phone?: InputMaybe<Scalars["String"]>;
  pesel?: InputMaybe<Scalars["String"]>;
  citizenship?: InputMaybe<Scalars["String"]>;
  payers?: InputMaybe<PayerInput>;
  stayAddresses?: InputMaybe<StayAddressInput>;
  email?: InputMaybe<Scalars["String"]>;
  passportNumber?: InputMaybe<Scalars["String"]>;
}

export interface PatientInsuranceInfo {
  current?: Maybe<PatientInsuranceStatusEvent>;
  latestPositive?: Maybe<PatientInsuranceStatusEvent>;
}

export interface PatientInsuranceStatementData {
  reason: InsuranceStatementPatientReason;
}

export type PatientInsuranceStatementEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  reason?: Maybe<Scalars["String"]>;
  representativePatient?: Maybe<Patient>;
};

export type PatientInsuranceStatusEvent = InsuranceStatusEvent | UnknownEvent;

export interface PatientTag {
  id: Scalars["String"];
  type: Scalars["String"];
  patientId: Scalars["String"];
  data: Scalars["JSON"];
  createdAt: Time;
  updatedAt: Time;
  history?: Maybe<History[]>;
  expirationAt?: Maybe<Scalars["DateTime"]>;
  confirmationType?: Maybe<ConfirmationType>;
  createdBy?: Maybe<Doctor>;
}

export interface PatientTagEntity {
  id: Scalars["String"];
  createdAt: Scalars["String"];
  data: Scalars["JSON"];
  patientId: Scalars["String"];
  type: PatientTagType;
  updatedAt: Scalars["DateTime"];
  history?: Maybe<Scalars["JSON"]>;
  expirationAt?: Maybe<Scalars["DateTime"]>;
  confirmationType?: Maybe<ConfirmationType>;
  createdBy?: Maybe<Doctor>;
}

export interface PatientTagInput {
  type: PatientTagType;
  patientId: Scalars["String"];
  data: Scalars["JSON"];
  expirationAt?: InputMaybe<Scalars["DateTime"]>;
  confirmationType?: InputMaybe<ConfirmationType>;
}

export enum PatientTagType {
  HOSPITALIZATION = "HOSPITALIZATION",
  ADDITIONAL = "ADDITIONAL",
  SURGICAL_PROCEDURES = "SURGICAL_PROCEDURES",
  ALLERGY = "ALLERGY",
  VACCINES = "VACCINES",
  SPEC_CONSULTATIONS = "SPEC_CONSULTATIONS",
  EDM_VACCINE = "EDM_VACCINE",
  CHRONIC_DISEASE = "CHRONIC_DISEASE",
  REGULAR_DRUG = "REGULAR_DRUG",
}

export interface Payer {
  id: Scalars["String"];
  name: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  nip: Scalars["String"];
  pesel: Scalars["String"];
  passportNumber: Scalars["String"];
  pueProfile: Scalars["String"];
}

export interface PayerInput {
  name?: InputMaybe<Scalars["String"]>;
  firstName?: InputMaybe<Scalars["String"]>;
  lastName?: InputMaybe<Scalars["String"]>;
  nip: Scalars["String"];
  pesel?: InputMaybe<Scalars["String"]>;
  passportNumber?: InputMaybe<Scalars["String"]>;
  pueProfile?: InputMaybe<Scalars["String"]>;
}

export interface PaymentDetails {
  value: Scalars["String"];
  price: Scalars["String"];
  description: Scalars["String"];
  detailedDescription: Scalars["String"];
  type: Scalars["String"];
  paymentKey: Scalars["String"];
}

export interface PlaceData {
  /** If not present -> it's our own place */
  partnerName?: Maybe<Scalars["String"]>;
  street: Scalars["String"];
  houseNumber: Scalars["String"];
  city: Scalars["String"];
  photos: Array<Scalars["String"]>;
  openingHoursWhole: OpeningHours[];
  openingHoursCollections: OpeningHours[];
  openingHoursProcedures: OpeningHours[];
  latitude: Scalars["Float"];
  longtitude: Scalars["Float"];
}

export interface PlacematicAddress {
  city: Scalars["String"];
  street: Scalars["String"];
  zipCode: Scalars["String"];
  houseNumber: Scalars["String"];
  latitude: Scalars["Float"];
  longitude: Scalars["Float"];
  teryt: Scalars["String"];
  state: Scalars["String"];
  municipality: Scalars["String"];
}

export interface PlacematicAddressInput {
  city: Scalars["String"];
  street: Scalars["String"];
  zipCode: Scalars["String"];
  houseNumber: Scalars["String"];
  latitude: Scalars["Float"];
  longitude: Scalars["Float"];
  teryt: Scalars["String"];
  state: Scalars["String"];
  municipality: Scalars["String"];
}

export interface Position {
  serviceId?: Maybe<Scalars["String"]>;
  sampleId?: Maybe<Scalars["String"]>;
  priceData?: Maybe<PriceData>;
  cancelled?: Maybe<Scalars["Boolean"]>;
  positionData?: Maybe<DynamicPositionData>;
  serviceName?: Maybe<Scalars["String"]>;
  price?: Maybe<Scalars["Float"]>;
  isNFZ?: Maybe<Scalars["Boolean"]>;
}

export interface PositionInput {
  serviceId: Scalars["String"];
  isNFZ: Scalars["Boolean"];
}

export interface PregnacyDetails {
  entirePregnacy: KeyValue;
  firstTrimester: KeyValue;
  secondTrimester: KeyValue;
  thirdTrimester: KeyValue;
  lactation: KeyValue;
}

export type Prescription = BaseMessage &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: MessageType;
    stripeSessionId: Scalars["String"];
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    visitId: Scalars["String"];
    writeup: Time;
    startsToWork?: Maybe<Time>;
    endsToWork?: Maybe<Time>;
    insuredIn: Scalars["String"];
    drugs: Drug[];
    code: Scalars["String"];
    number: Scalars["String"];
    prescriptionId?: Maybe<Scalars["String"]>;
    options?: Maybe<PrescriptionOptions>;
    isCustom: Scalars["Boolean"];
    doctor: Doctor;
    patient: Patient;
    visit: Visit;
    resourceCancelationInCezDate?: Maybe<Scalars["DateTime"]>;
    resourceIsCompatibleWithCez?: Maybe<Scalars["Boolean"]>;
  };

export interface PrescriptionChatMessageDeletedEvent {
  message: ChatMessageEntity;
}

export interface PrescriptionInput {
  visitId: Scalars["String"];
  assignmentType: Scalars["String"];
  data: Scalars["JSON"];
  positions: PositionInput[];
}

export interface PrescriptionOptions {
  in365days: Scalars["Boolean"];
  cito?: Maybe<Scalars["Boolean"]>;
  dontChange?: Maybe<Scalars["Boolean"]>;
}

export interface PrescriptionResult {
  messageId: Scalars["String"];
  prescriptionCode: Scalars["String"];
}

export type Pressure = BaseVital &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: VitalType;
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    messageId: Scalars["String"];
    visitId: Scalars["String"];
    measured?: Maybe<Time>;
    delivered?: Maybe<Time>;
    overrideFiles?: Maybe<Array<Scalars["String"]>>;
    customDate?: Maybe<Time>;
    systolic: Scalars["Int"];
    diastolic: Scalars["Int"];
    patient?: Maybe<Patient>;
    doctor?: Maybe<Doctor>;
    message?: Maybe<Message>;
    visit?: Maybe<Visit>;
  };

export interface PriceData {
  name?: Maybe<Scalars["String"]>;
  value?: Maybe<Scalars["String"]>;
  original?: Maybe<Scalars["String"]>;
  NFZ?: Maybe<Scalars["String"]>;
}

export interface ProcedureAnswer {
  question?: Maybe<Scalars["String"]>;
  answer?: Maybe<Scalars["String"]>;
  comment?: Maybe<Scalars["String"]>;
}

export interface ProcedureAnswerInput {
  question?: InputMaybe<Scalars["String"]>;
  answer?: InputMaybe<Scalars["String"]>;
  comment?: InputMaybe<Scalars["String"]>;
}

export interface ProcedureBandage {
  name?: Maybe<Scalars["String"]>;
  productSeries?: Maybe<Scalars["String"]>;
  expirationDate?: Maybe<Scalars["String"]>;
  used?: Maybe<Scalars["String"]>;
}

export interface ProcedureBandageInput {
  name?: InputMaybe<Scalars["String"]>;
  productSeries?: InputMaybe<Scalars["String"]>;
  expirationDate?: InputMaybe<Scalars["String"]>;
  used?: InputMaybe<Scalars["String"]>;
}

export interface ProcedureDataInput {
  disinfectant?: InputMaybe<ProcedureDisinfectantInput[]>;
  tool?: InputMaybe<ProcedureToolInput[]>;
  drug?: InputMaybe<ProcedureDrugInput[]>;
  bandage?: InputMaybe<ProcedureBandageInput[]>;
  measurement?: InputMaybe<MeasurementInput[]>;
  vaccine?: InputMaybe<VaccineInput[]>;
  file?: InputMaybe<Array<Scalars["String"]>>;
  dressingChange?: InputMaybe<ProcedureDressingChangeInput>;
  stitch?: InputMaybe<ProcedureStitchInput>;
  foreignBody?: InputMaybe<ProcedureForeignBodyInput>;
  medication?: InputMaybe<ProcedureMedicationInput>;
  ekg?: InputMaybe<ProcedureEKGInput>;
  education?: InputMaybe<ProcedureEducationInput>;
  vaccineData?: InputMaybe<ProcedureVaccineBasicDataInput>;
  spirometry?: InputMaybe<ProcedureSpirometryInput>;
  observations?: InputMaybe<Scalars["String"]>;
  isEditingLocked?: InputMaybe<Scalars["Boolean"]>;
  answers?: InputMaybe<ProcedureAnswerInput[]>;
}

export interface ProcedureDisinfectant {
  name?: Maybe<Scalars["String"]>;
  productSeries?: Maybe<Scalars["String"]>;
  expirationDate?: Maybe<Scalars["String"]>;
  used?: Maybe<Scalars["String"]>;
}

export interface ProcedureDisinfectantInput {
  name?: InputMaybe<Scalars["String"]>;
  productSeries?: InputMaybe<Scalars["String"]>;
  expirationDate?: InputMaybe<Scalars["String"]>;
  used?: InputMaybe<Scalars["String"]>;
}

export interface ProcedureDressingChange {
  place?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  secretion?: Maybe<SecretionType>;
  woundClassification?: Maybe<Array<Scalars["String"]>>;
  woundHealingStatus?: Maybe<WoundHealingStatus>;
}

export interface ProcedureDressingChangeInput {
  place?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
  secretion?: InputMaybe<SecretionType>;
  woundClassification?: InputMaybe<Array<Scalars["String"]>>;
  woundHealingStatus?: InputMaybe<WoundHealingStatus>;
}

export interface ProcedureDrug {
  name?: Maybe<Scalars["String"]>;
  productSeries?: Maybe<Scalars["String"]>;
  expirationDate?: Maybe<Scalars["String"]>;
  used?: Maybe<Scalars["String"]>;
}

export interface ProcedureDrugInput {
  name?: InputMaybe<Scalars["String"]>;
  productSeries?: InputMaybe<Scalars["String"]>;
  expirationDate?: InputMaybe<Scalars["String"]>;
  used?: InputMaybe<Scalars["String"]>;
}

export interface ProcedureEKG {
  comment?: Maybe<Scalars["String"]>;
  cito?: Maybe<Scalars["Boolean"]>;
}

export interface ProcedureEKGInput {
  comment?: InputMaybe<Scalars["String"]>;
  cito?: InputMaybe<Scalars["Boolean"]>;
}

export interface ProcedureEducation {
  comment?: Maybe<Scalars["String"]>;
}

export interface ProcedureEducationInput {
  comment?: InputMaybe<Scalars["String"]>;
}

export interface ProcedureEntity {
  id: Scalars["String"];
  patientId: Scalars["String"];
  visitId?: Maybe<Scalars["String"]>;
  createdOnVisitId?: Maybe<Scalars["String"]>;
  data?: Maybe<Scalars["JSON"]>;
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  type: ProcedureType;
  createdBy?: Maybe<Scalars["String"]>;
  paid: Scalars["Boolean"];
  messageId?: Maybe<Scalars["String"]>;
  executionLimit: Scalars["String"];
  cancelled: Scalars["Boolean"];
  displayName: Scalars["String"];
  disinfectants: ProcedureDisinfectant[];
  tools: ProcedureTool[];
  drugs: ProcedureDrug[];
  bandages: ProcedureBandage[];
  measurements: ProcedureMeasurement[];
  vaccines: ProcedureVaccine[];
  files: Array<Scalars["String"]>;
  dressingChange?: Maybe<ProcedureDressingChange>;
  stitch?: Maybe<ProcedureStitch>;
  foreignBody?: Maybe<ProcedureForeignBody>;
  medication?: Maybe<ProcedureMedication>;
  ekg?: Maybe<ProcedureEKG>;
  education?: Maybe<ProcedureEducation>;
  vaccineData?: Maybe<ProcedureVaccineBasicData>;
  spirometry?: Maybe<ProcedureSpirometry>;
  observations: Scalars["String"];
  isEditingLocked: Scalars["Boolean"];
  answers: ProcedureAnswer[];
  creator: User;
  patient: Patient;
}

export interface ProcedureForeignBody {
  type?: Maybe<Scalars["String"]>;
  comment?: Maybe<Scalars["String"]>;
}

export interface ProcedureForeignBodyInput {
  type?: InputMaybe<Scalars["String"]>;
  comment?: InputMaybe<Scalars["String"]>;
}

export interface ProcedureMeasurement {
  systolicPressure?: Maybe<Scalars["String"]>;
  diastolicPressure?: Maybe<Scalars["String"]>;
  pulse?: Maybe<Scalars["String"]>;
  resultType?: Maybe<Scalars["String"]>;
}

export interface ProcedureMedication {
  name?: Maybe<Scalars["String"]>;
  dosing?: Maybe<Scalars["String"]>;
  injection?: Maybe<Scalars["Boolean"]>;
  cito?: Maybe<Scalars["Boolean"]>;
}

export interface ProcedureMedicationInput {
  name?: InputMaybe<Scalars["String"]>;
  dosing?: InputMaybe<Scalars["String"]>;
  injection?: InputMaybe<Scalars["Boolean"]>;
  cito?: InputMaybe<Scalars["Boolean"]>;
}

export interface ProcedureSpirometry {
  type?: Maybe<SpirometryType>;
  comment?: Maybe<Scalars["String"]>;
}

export interface ProcedureSpirometryInput {
  type?: InputMaybe<SpirometryType>;
  comment?: InputMaybe<Scalars["String"]>;
}

export interface ProcedureStitch {
  place?: Maybe<Scalars["String"]>;
  woundHealingStatus?: Maybe<WoundHealingStatus>;
}

export interface ProcedureStitchInput {
  place?: InputMaybe<Scalars["String"]>;
  woundHealingStatus?: InputMaybe<WoundHealingStatus>;
}

export interface ProcedureTool {
  name?: Maybe<Scalars["String"]>;
  productSeries?: Maybe<Scalars["String"]>;
  expirationDate?: Maybe<Scalars["String"]>;
  used?: Maybe<Scalars["String"]>;
}

export interface ProcedureToolInput {
  name?: InputMaybe<Scalars["String"]>;
  productSeries?: InputMaybe<Scalars["String"]>;
  expirationDate?: InputMaybe<Scalars["String"]>;
  used?: InputMaybe<Scalars["String"]>;
}

export enum ProcedureType {
  BANDAGE = "BANDAGE",
  STITCHES = "STITCHES",
  EKG = "EKG",
  EDUCATION = "EDUCATION",
  DRUGPASS = "DRUGPASS",
  SPIRO = "SPIRO",
  OBJECT = "OBJECT",
  VACCINE = "VACCINE",
  QUALIFICATION_FOR_VACCINATION = "QUALIFICATION_FOR_VACCINATION",
}

export interface ProcedureVaccine {
  name?: Maybe<Scalars["String"]>;
  productSeries?: Maybe<Scalars["String"]>;
  expirationDate?: Maybe<Scalars["String"]>;
  dose?: Maybe<Scalars["String"]>;
}

export interface ProcedureVaccineBasicData {
  name?: Maybe<Scalars["String"]>;
  comment?: Maybe<Scalars["String"]>;
}

export interface ProcedureVaccineBasicDataInput {
  name: Scalars["String"];
  comment: Scalars["String"];
}

export interface Query {
  getSlots: FreeTime[];
  organizations: OrganizationEntity[];
  findAddress: PlacematicAddress[];
  getDoctorsWithAvailableSlots: Doctor[];
  diag: Diag[];
  laboratoryExaminationDiagsWithPackets: DiagOrPacket[];
  nfzHistory: NfzHistoryEvent[];
  patientInsuranceStatus: PatientInsuranceInfo;
  patientDeclarationHistory: PatientDeclarationHistoryEvent[];
  validateSku: Scalars["Boolean"];
  authorizeDoctor: Scalars["String"];
  validateToken: Scalars["String"];
  getPatientDocs: Scalars["String"];
  me: Doctor;
  patient?: Maybe<Patient>;
  patients: Patient[];
  doctor: Doctor;
  doctors: Doctor[];
  packages: Package[];
  getDrugDetails: DrugDetails;
  regularDrugs: RegularDrug[];
  wards: Array<Scalars["String"]>;
  drugRecipes: DrugRecipe[];
  clinics: Clinic[];
  getAdditionalRefundRightsWithExplanation: Scalars["JSON"];
  ICD10: Array<Scalars["String"]>;
  ICD9: Array<Scalars["String"]>;
  nextPatient: Scalars["String"];
  nextPatients: Patient[];
  getMessagesForPatient: Message[];
  getPrescriptionsForPatient: Prescription[];
  getReferralsForPatient: Referral[];
  leaves: Leave[];
  visit: Visit;
  getVisitsPerDayForDoctor: Visit[];
  myUpcomingVisits: Visit[];
  scheduledVisits: Visit[];
  visitsForPatients: Visit[];
  upcomingVisits: Visit[];
  draftVisits: Visit[];
  historyVisits: Visit[];
  getDoctorsVisits: Visit[];
  snippets: Snippet[];
  snippetTags: SelectOption[];
  medicineSubtitles: MedicineSubtitle[];
  chatMessages: ChatMessageEntity[];
  groupByChatMessage: ChatMessageEntity[];
  procedures: ProcedureEntity[];
  laboratoryExaminations: LaboratoryExaminationEntity[];
  nfzEvents: NFZEventEntity[];
}

export interface QuerygetSlotsArgs {
  requiredLanguages?: InputMaybe<SupportedLanguage[]>;
  organizationIds?: InputMaybe<Array<Scalars["String"]>>;
  organizationId?: InputMaybe<Scalars["String"]>;
  doctorId?: InputMaybe<Scalars["String"]>;
  end?: InputMaybe<Scalars["Float"]>;
  start?: InputMaybe<Scalars["Float"]>;
  slotsInRow?: InputMaybe<Scalars["Float"]>;
  type: SlotType;
}

export interface QueryfindAddressArgs {
  query: Scalars["String"];
}

export interface QuerygetDoctorsWithAvailableSlotsArgs {
  organizationId?: InputMaybe<Scalars["String"]>;
  end?: InputMaybe<Scalars["Float"]>;
  start?: InputMaybe<Scalars["Float"]>;
  type: SlotType;
}

export interface QuerydiagArgs {
  organizationId?: InputMaybe<Scalars["String"]>;
  type: AssignmentType;
  search: Scalars["String"];
}

export interface QuerylaboratoryExaminationDiagsWithPacketsArgs {
  organizationId?: InputMaybe<Scalars["String"]>;
  search: Scalars["String"];
}

export interface QuerynfzHistoryArgs {
  patientId: Scalars["String"];
}

export interface QuerypatientInsuranceStatusArgs {
  patientId: Scalars["String"];
}

export interface QuerypatientDeclarationHistoryArgs {
  patientId: Scalars["String"];
}

export interface QueryvalidateSkuArgs {
  sku: Scalars["String"];
}

export interface QueryauthorizeDoctorArgs {
  password: Scalars["String"];
  phone: Scalars["String"];
}

export interface QuerygetPatientDocsArgs {
  patientId: Scalars["String"];
}

export interface QuerypatientArgs {
  patientCardNumber?: InputMaybe<Scalars["String"]>;
  pesel?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["String"]>;
}

export interface QuerypatientsArgs {
  fullText?: InputMaybe<Scalars["String"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  take: Scalars["Int"];
}

export interface QuerydoctorArgs {
  id: Scalars["String"];
}

export interface QuerydoctorsArgs {
  id?: InputMaybe<Scalars["String"]>;
}

export interface QuerypackagesArgs {
  name: Scalars["String"];
}

export interface QuerygetDrugDetailsArgs {
  ean: Scalars["String"];
}

export interface QueryregularDrugsArgs {
  patientId: Scalars["String"];
}

export interface QueryICD10Args {
  search: Scalars["String"];
}

export interface QueryICD9Args {
  search: Scalars["String"];
}

export interface QuerygetMessagesForPatientArgs {
  patientId: Scalars["String"];
}

export interface QuerygetPrescriptionsForPatientArgs {
  patientId: Scalars["String"];
}

export interface QuerygetReferralsForPatientArgs {
  patientId: Scalars["String"];
}

export interface QueryleavesArgs {
  patientId: Scalars["String"];
}

export interface QueryvisitArgs {
  id: Scalars["String"];
}

export interface QuerygetVisitsPerDayForDoctorArgs {
  doctorId?: InputMaybe<Scalars["String"]>;
  forDay: Scalars["DateTime"];
}

export interface QueryscheduledVisitsArgs {
  doctorIds?: InputMaybe<Array<Scalars["String"]>>;
  organizationId?: InputMaybe<Scalars["String"]>;
  forDay: Scalars["DateTime"];
}

export interface QueryvisitsForPatientsArgs {
  patientIds: Array<Scalars["String"]>;
  forDay: Scalars["DateTime"];
}

export interface QueryupcomingVisitsArgs {
  patientId: Scalars["String"];
}

export interface QuerydraftVisitsArgs {
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  patientId: Scalars["String"];
}

export interface QueryhistoryVisitsArgs {
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  patientId: Scalars["String"];
}

export interface QuerygetDoctorsVisitsArgs {
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  plannedStartGte: Scalars["DateTime"];
  doctorId: Scalars["String"];
  visitType: VisitType;
}

export interface QuerysnippetsArgs {
  id?: InputMaybe<Scalars["String"]>;
}

export interface QuerymedicineSubtitlesArgs {
  type: PatientTagType;
}

export interface QuerychatMessagesArgs {
  createdAtLt?: InputMaybe<Scalars["DateTime"]>;
  createdAtGt?: InputMaybe<Scalars["DateTime"]>;
  take?: InputMaybe<Scalars["Int"]>;
  patientId: Scalars["String"];
}

export interface QuerygroupByChatMessageArgs {
  forDay: Scalars["DateTime"];
  authorId: Scalars["String"];
}

export interface QueryproceduresArgs {
  id?: InputMaybe<Scalars["String"]>;
  patientId?: InputMaybe<Scalars["String"]>;
}

export interface QuerylaboratoryExaminationsArgs {
  groupId?: InputMaybe<Scalars["String"]>;
  ids?: InputMaybe<Array<Scalars["String"]>>;
  patientId?: InputMaybe<Scalars["String"]>;
}

export interface QuerynfzEventsArgs {
  patientId: Scalars["String"];
}

export interface Range {
  min: Scalars["String"];
  max: Scalars["String"];
}

export enum RealNFZStatusType {
  NOTDECLARABLE = "NOTDECLARABLE",
  TODECLARE = "TODECLARE",
  P = "P",
  Z = "Z",
  O = "O",
  PENDING = "PENDING",
  DONOTREPORT = "DONOTREPORT",
}

export type Referral = BaseMessage &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: MessageType;
    stripeSessionId: Scalars["String"];
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    visitId: Scalars["String"];
    referralType: Scalars["String"];
    icd10?: Maybe<ICD10Main>;
    icd9?: Maybe<ICD9Main>;
    comment?: Maybe<Scalars["String"]>;
    purpose?: Maybe<Scalars["String"]>;
    clinic?: Maybe<ClinicDetails>;
    ward?: Maybe<WardDetails>;
    referralDetails: ReferralDetails;
    urgent?: Maybe<Scalars["Boolean"]>;
    examinationType?: Maybe<Scalars["String"]>;
    adviceGoal?: Maybe<Scalars["String"]>;
    doctor: Doctor;
    patient: Patient;
    visit: Visit;
  };

export interface ReferralDetails {
  code?: Maybe<Scalars["String"]>;
  key: Scalars["String"];
}

export enum RegistrationSource {
  WEB = "WEB",
  MOBILE = "MOBILE",
}

export interface RegularDrug {
  sourceTag: PatientTagEntity;
  drugDetails?: Maybe<DrugDetails>;
}

export interface RepresentativeInsuranceStatementData {
  reason: InsuranceStatementRepresentativeReason;
  representativePatientId?: InputMaybe<Scalars["String"]>;
}

export type Rtg = BaseVital &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: VitalType;
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    messageId: Scalars["String"];
    visitId: Scalars["String"];
    measured?: Maybe<Time>;
    delivered?: Maybe<Time>;
    overrideFiles?: Maybe<Array<Scalars["String"]>>;
    customDate?: Maybe<Time>;
    patient?: Maybe<Patient>;
    doctor?: Maybe<Doctor>;
    message?: Maybe<Message>;
    visit?: Maybe<Visit>;
  };

export interface SecretData {
  nice?: Maybe<Scalars["Boolean"]>;
  notnice?: Maybe<Scalars["Boolean"]>;
  physicallydisabled?: Maybe<Scalars["Boolean"]>;
  hearingdisabled?: Maybe<Scalars["Boolean"]>;
  pregnant?: Maybe<Scalars["Boolean"]>;
  breastfeeding?: Maybe<Scalars["Boolean"]>;
  description?: Maybe<Scalars["String"]>;
}

export interface SecretDataInput {
  nice?: InputMaybe<Scalars["Boolean"]>;
  notnice?: InputMaybe<Scalars["Boolean"]>;
  physicallydisabled?: InputMaybe<Scalars["Boolean"]>;
  hearingdisabled?: InputMaybe<Scalars["Boolean"]>;
  pregnant?: InputMaybe<Scalars["Boolean"]>;
  breastfeeding?: InputMaybe<Scalars["Boolean"]>;
  description?: InputMaybe<Scalars["String"]>;
}

export enum SecretionType {
  BLOODY = "BLOODY",
  PURULENT = "PURULENT",
  SEROUS = "SEROUS",
}

export interface SelectOption {
  label: Scalars["String"];
  value: Scalars["String"];
}

export interface SelectOptionInput {
  label: Scalars["String"];
  value: Scalars["String"];
}

export enum SlotType {
  TELEMEDICAL = "TELEMEDICAL",
  TELEMEDICAL_PRIVATE = "TELEMEDICAL_PRIVATE",
  PERSONAL = "PERSONAL",
  COLLECTION = "COLLECTION",
  PROCEDURES = "PROCEDURES",
  TELEMEDICAL_NEW_CITIES = "TELEMEDICAL_NEW_CITIES",
}

export interface Snippet {
  id: Scalars["String"];
  name: Scalars["String"];
  ownerId?: Maybe<Scalars["String"]>;
  type: SnippetType;
  visibility: SnippetVisibility;
  content: Scalars["String"];
  priority: Scalars["Int"];
  counter: Scalars["Int"];
  category: Scalars["String"];
  tags: SelectOption[];
}

export interface SnippetEntity {
  id: Scalars["String"];
  category?: Maybe<Scalars["String"]>;
  content: Scalars["String"];
  counter: Scalars["Float"];
  name: Scalars["String"];
  ownerId?: Maybe<Scalars["String"]>;
  priority: Scalars["Float"];
  tags: Scalars["JSON"];
  type: SnippetType;
  visibility: SnippetVisibility;
}

export interface SnippetInput {
  name?: InputMaybe<Scalars["String"]>;
  ownerId?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<SnippetType>;
  visibility?: InputMaybe<SnippetVisibility>;
  content?: InputMaybe<Scalars["String"]>;
  priority?: InputMaybe<Scalars["Int"]>;
  counter?: InputMaybe<Scalars["Int"]>;
  category?: InputMaybe<Scalars["String"]>;
  tags?: InputMaybe<SelectOptionInput[]>;
}

export enum SnippetType {
  CHAT = "CHAT",
  DOCS = "DOCS",
}

export enum SnippetVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export type Spiro = BaseVital &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: VitalType;
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    messageId: Scalars["String"];
    visitId: Scalars["String"];
    measured?: Maybe<Time>;
    delivered?: Maybe<Time>;
    overrideFiles?: Maybe<Array<Scalars["String"]>>;
    customDate?: Maybe<Time>;
    genre?: Maybe<Scalars["String"]>;
    file?: Maybe<Scalars["String"]>;
    comments?: Maybe<Scalars["String"]>;
    patient?: Maybe<Patient>;
    doctor?: Maybe<Doctor>;
    message?: Maybe<Message>;
    visit?: Maybe<Visit>;
  };

export enum SpirometryType {
  NORMAL = "NORMAL",
  WITH_DIASTOLIC_TEST = "WITH_DIASTOLIC_TEST",
}

export interface StaffEntity {
  id: Scalars["String"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  genre: UserGenre;
  organizationId: Scalars["String"];
  history?: Maybe<History>;
  files?: Maybe<Scalars["JSON"]>;
  avatar?: Maybe<Scalars["String"]>;
  blocked: Scalars["Boolean"];
  email?: Maybe<Scalars["String"]>;
  medicalPushToken?: Maybe<Scalars["JSON"]>;
  pesel?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  pushToken?: Maybe<Scalars["String"]>;
  uniqueIntegerId?: Maybe<Scalars["Float"]>;
  unsuccessfulAuth?: Maybe<Scalars["Boolean"]>;
  isActive?: Maybe<Scalars["Boolean"]>;
  unread: Scalars["Float"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  npwz?: Maybe<Scalars["String"]>;
  signature?: Maybe<Scalars["String"]>;
  hiddenSnippets?: Maybe<Array<Scalars["String"]>>;
  passwordHash: Scalars["String"];
  isDeclarable?: Maybe<Scalars["Boolean"]>;
  declaringToOrganizationId: Scalars["String"];
  sipNumber?: Maybe<Scalars["String"]>;
}

export enum StateInsurance {
  ZUS = "ZUS",
  KRUS = "KRUS",
  OTHER_IN_POLAND = "OTHER_IN_POLAND",
  OTHER_COUNTRY = "OTHER_COUNTRY",
}

export interface StayAddress {
  city: Scalars["String"];
  country?: Maybe<Scalars["String"]>;
  street: Scalars["String"];
  houseNumber: Scalars["String"];
  flatNumber?: Maybe<Scalars["String"]>;
  zipCode: Scalars["String"];
  notes?: Maybe<Scalars["String"]>;
}

export interface StayAddressInput {
  city: Scalars["String"];
  country?: InputMaybe<Scalars["String"]>;
  street: Scalars["String"];
  houseNumber: Scalars["String"];
  flatNumber?: InputMaybe<Scalars["String"]>;
  zipCode: Scalars["String"];
  notes?: InputMaybe<Scalars["String"]>;
}

export interface Subscription {
  handleMessagesUpdates: ChatMessagesUpdateEvent;
}

export interface SubscriptionhandleMessagesUpdatesArgs {
  patientId: Scalars["String"];
}

export enum SupportedLanguage {
  EN = "EN",
  PL = "PL",
  UK = "UK",
}

export interface Survey {
  weight: Scalars["String"];
  height: Scalars["String"];
  risks: Answer[];
}

export interface SurveyProposal {
  id: Scalars["String"];
  patientId: Scalars["String"];
  visitId: Scalars["String"];
  formId: Scalars["String"];
  isFilled: Scalars["Boolean"];
  data: Scalars["JSON"];
  schema: Scalars["JSON"];
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
}

export interface SurveyProposalEntity {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  data?: Maybe<Scalars["JSON"]>;
  formId: Scalars["String"];
  isFilled: Scalars["String"];
  patientId: Scalars["String"];
  updatedAt: Scalars["DateTime"];
}

export interface SurveyProposalInput {
  formId: Scalars["String"];
  patientId: Scalars["String"];
}

export enum TagType {
  LOCALIZATION = "LOCALIZATION",
  EXAMINATION = "EXAMINATION",
  OFFICE = "OFFICE",
  DOCTOR = "DOCTOR",
}

export interface Term {
  id: Scalars["String"];
  intervals: DoctorInterval[];
  type: TermType;
  date: Scalars["String"];
  tags: TermTag[];
  doctorId: Scalars["String"];
  slotSize: Scalars["Int"];
}

export interface TermTag {
  type: TagType;
  value: Scalars["String"];
  userId: Scalars["String"];
}

export enum TermType {
  DOCTORWEEK = "DOCTORWEEK",
  DOCTORDAY = "DOCTORDAY",
  PLACE = "PLACE",
  BLOCKER = "BLOCKER",
}

export type Testimonial = BaseMessage &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: MessageType;
    stripeSessionId: Scalars["String"];
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    visitId: Scalars["String"];
    testimonialType: Scalars["String"];
    data: Scalars["JSON"];
    doctor: Doctor;
    patient: Patient;
    visit: Visit;
  };

export interface TestimonialInput {
  visitId: Scalars["String"];
  testimonialType: Scalars["String"];
  data: Scalars["JSON"];
}

export interface Time {
  iso: Scalars["String"];
  local: Scalars["String"];
}

export interface UnderCarePerson {
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  birthDate: Scalars["String"];
  type: Scalars["String"];
}

export type UnknownEvent = NfzEventBase & {
  id: Scalars["String"];
  createdAt: Scalars["DateTime"];
  type: Scalars["String"];
  data?: Maybe<Scalars["JSON"]>;
  error?: Maybe<Scalars["String"]>;
};

export interface UpdateDocumentInput {
  tagId?: InputMaybe<Scalars["String"]>;
  starred?: InputMaybe<Scalars["Boolean"]>;
}

export interface UpdateProcedureInput {
  cancelled?: InputMaybe<Scalars["Boolean"]>;
  visitId?: InputMaybe<Scalars["String"]>;
  patientId?: InputMaybe<Scalars["String"]>;
}

export type User = Doctor | Patient;

export interface UserEntity {
  id: Scalars["String"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  genre: UserGenre;
  organizationId: Scalars["String"];
  history?: Maybe<History>;
  files?: Maybe<Scalars["JSON"]>;
  avatar?: Maybe<Scalars["String"]>;
  blocked: Scalars["Boolean"];
  email?: Maybe<Scalars["String"]>;
  medicalPushToken?: Maybe<Scalars["JSON"]>;
  pesel?: Maybe<Scalars["String"]>;
  phone?: Maybe<Scalars["String"]>;
  pushToken?: Maybe<Scalars["String"]>;
  uniqueIntegerId?: Maybe<Scalars["Float"]>;
  unsuccessfulAuth?: Maybe<Scalars["Boolean"]>;
  isActive?: Maybe<Scalars["Boolean"]>;
  unread: Scalars["Float"];
  updatedAt?: Maybe<Scalars["DateTime"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  address?: Maybe<Address>;
  analyticsData?: Maybe<AnalyticsData>;
  analyticsId?: Maybe<Scalars["String"]>;
  citizenship?: Maybe<Scalars["String"]>;
  declarationType?: Maybe<Scalars["String"]>;
  declarations?: Maybe<Declaration[]>;
  ewusCheckHistory?: Maybe<History>;
  ewusCheck?: Maybe<EwusCheck>;
  hiddenSnippets?: Maybe<Array<Scalars["String"]>>;
  izolacja?: Maybe<Scalars["String"]>;
  kwarantanna?: Maybe<Scalars["String"]>;
  marketing?: Maybe<Scalars["Boolean"]>;
  oneTimeSurvey?: Maybe<Survey>;
  passportCountry?: Maybe<Scalars["String"]>;
  passportNumber?: Maybe<Scalars["String"]>;
  patientCardNumber?: Maybe<Scalars["String"]>;
  secretData?: Maybe<SecretData>;
  signature?: Maybe<Scalars["String"]>;
  statusUbezpieczenia?: Maybe<Scalars["String"]>;
  stayAddresses?: Maybe<StayAddress[]>;
  stateInsurance: StateInsurance;
  chosenDoctor?: Maybe<Scalars["String"]>;
  chosenNurse?: Maybe<Scalars["String"]>;
  mobileAppVersion?: Maybe<Scalars["String"]>;
  lastPatientMessageBlock?: Maybe<Scalars["Float"]>;
  registrationType?: Maybe<Scalars["String"]>;
  deviceInfo?: Maybe<Scalars["String"]>;
  oneTimeSurveyUpdatedAt?: Maybe<Scalars["DateTime"]>;
  patientPublicSince?: Maybe<Scalars["DateTime"]>;
  assistantId?: Maybe<Scalars["String"]>;
  clientAppSettings?: Maybe<ClientAppSettings>;
}

export enum UserGenre {
  NURSE = "NURSE",
  STAFF = "STAFF",
  DOCTOR = "DOCTOR",
  ASSISTANT = "ASSISTANT",
  PATIENT = "PATIENT",
}

export interface UsersNotificationAgreementsEntity {
  id: Scalars["String"];
  userId: Scalars["String"];
  agreed: Scalars["Boolean"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
}

export type Usg = BaseVital &
  Global & {
    createdAt: Time;
    updatedAt: Time;
    id: Scalars["String"];
    type: VitalType;
    patientId: Scalars["String"];
    doctorId: Scalars["String"];
    messageId: Scalars["String"];
    visitId: Scalars["String"];
    measured?: Maybe<Time>;
    delivered?: Maybe<Time>;
    overrideFiles?: Maybe<Array<Scalars["String"]>>;
    customDate?: Maybe<Time>;
    patient?: Maybe<Patient>;
    doctor?: Maybe<Doctor>;
    message?: Maybe<Message>;
    visit?: Maybe<Visit>;
  };

export interface VaccineInput {
  name?: InputMaybe<Scalars["String"]>;
  productSeries?: InputMaybe<Scalars["String"]>;
  expirationDate?: InputMaybe<Scalars["String"]>;
  dose?: InputMaybe<Scalars["String"]>;
}

export type Visit = Global & {
  createdAt: Time;
  updatedAt: Time;
  id: Scalars["String"];
  type?: Maybe<VisitType>;
  note: Scalars["String"];
  patientId: Scalars["String"];
  doctorId?: Maybe<Scalars["String"]>;
  createdBy?: Maybe<Scalars["String"]>;
  snapshotBy?: Maybe<Scalars["String"]>;
  diagnosis: Diagnosis[];
  faqRead?: Maybe<FaqType[]>;
  status: VisitStatus;
  appointmentStatus: Scalars["String"];
  memo?: Maybe<Scalars["String"]>;
  doctorInterview?: Maybe<Scalars["String"]>;
  physicalExamination?: Maybe<Scalars["String"]>;
  doctorDiagnosis?: Maybe<Array<Maybe<Diagnosis>>>;
  recommendation?: Maybe<Scalars["String"]>;
  comment?: Maybe<Scalars["String"]>;
  innatePriority: VisitPriority;
  icd10Main?: Maybe<ICD10Main>;
  icd10Secondary?: Maybe<ICD10Main>;
  closedByBot?: Maybe<Scalars["Boolean"]>;
  plannedStart?: Maybe<Time>;
  plannedPlace?: Maybe<Scalars["String"]>;
  duration?: Maybe<Scalars["Int"]>;
  nurseDiagnosis?: Maybe<Diagnosis[]>;
  nursePhysicalExamination?: Maybe<Scalars["String"]>;
  startOn?: Maybe<Scalars["String"]>;
  showOn?: Maybe<Scalars["String"]>;
  leftOn?: Maybe<Scalars["String"]>;
  deletedAt?: Maybe<Scalars["String"]>;
  snapshotAt?: Maybe<Scalars["String"]>;
  invitationSentAt?: Maybe<Time>;
  invitationSentBy?: Maybe<Doctor>;
  organizationId?: Maybe<Scalars["String"]>;
  slotType?: Maybe<Scalars["String"]>;
  recommendationsMessageId?: Maybe<Scalars["String"]>;
  patient?: Maybe<Patient>;
  doctor?: Maybe<Doctor>;
  source: Visit;
  children: Visit[];
  surveys: SurveyProposal[];
  procedures: ProcedureEntity[];
  laboratoryExaminations: LaboratoryExaminationEntity[];
  createdByUsername: Scalars["String"];
  isPublicVisit: Scalars["Boolean"];
  availableImaginingOrganizationId: Scalars["String"];
  recommendationsMessage?: Maybe<ChatMessageEntity>;
  rating: VisitsRatingEntity;
};

export interface VisitInput {
  memo?: InputMaybe<Scalars["String"]>;
  doctorInterview?: InputMaybe<Scalars["String"]>;
  physicalExamination?: InputMaybe<Scalars["String"]>;
  doctorDiagnosis?: InputMaybe<Array<InputMaybe<DiagnosisInput>>>;
  recommendation?: InputMaybe<Scalars["String"]>;
  comment?: InputMaybe<Scalars["String"]>;
  innatePriority?: InputMaybe<VisitPriority>;
  icd10Main?: InputMaybe<ICD10Input>;
  icd10Secondary?: InputMaybe<ICD10Input>;
  nurseDiagnosis?: InputMaybe<Array<InputMaybe<DiagnosisInput>>>;
  nursePhysicalExamination?: InputMaybe<Scalars["String"]>;
  appointmentStatus?: InputMaybe<AppointmentStatus>;
}

export enum VisitPriority {
  INDETERMINATE = "INDETERMINATE",
  STANDARD = "STANDARD",
  URGENT = "URGENT",
  IMMEDIATE = "IMMEDIATE",
}

export enum VisitStatus {
  DRAFT = "DRAFT",
  INPROGRESS = "INPROGRESS",
  SUCCESS = "SUCCESS",
  ARCHIVE = "ARCHIVE",
}

export enum VisitType {
  STANDARD = "STANDARD",
  PROCEDURE = "PROCEDURE",
  VIRTUAL = "VIRTUAL",
}

export interface VisitsRatingEntity {
  id: Scalars["String"];
  visitId: Scalars["String"];
  userId: Scalars["String"];
  rating: Scalars["Float"];
  answers: Scalars["JSON"];
  formId?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  updatedAt: Scalars["DateTime"];
}

export type Vital =
  | Analysis
  | Ct
  | Ekg
  | Heartrate
  | Injection
  | Operation
  | Other
  | Pressure
  | Rtg
  | Spiro
  | Usg;

export interface VitalEntity {
  id: Scalars["String"];
  analysisType?: Maybe<Scalars["String"]>;
  closed?: Maybe<Scalars["Boolean"]>;
  comments?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  customComment?: Maybe<Scalars["String"]>;
  customDate?: Maybe<Scalars["String"]>;
  customName?: Maybe<Scalars["String"]>;
  delivered?: Maybe<Scalars["String"]>;
  diastolic?: Maybe<Scalars["String"]>;
  doctorId?: Maybe<Scalars["String"]>;
  drugs: Scalars["JSON"];
  genre?: Maybe<Scalars["String"]>;
  injectionType?: Maybe<Scalars["String"]>;
  measured?: Maybe<Scalars["String"]>;
  messageId?: Maybe<Scalars["String"]>;
  overrideFiles: Scalars["JSON"];
  params: Scalars["JSON"];
  patientId?: Maybe<Scalars["String"]>;
  positionId?: Maybe<Scalars["String"]>;
  rate?: Maybe<Scalars["String"]>;
  systolic?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
  visitId?: Maybe<Scalars["String"]>;
}

export interface VitalInput {
  type: VitalType;
  patientId: Scalars["String"];
  overrideFiles: Array<Scalars["String"]>;
}

export enum VitalType {
  ANALYSIS = "ANALYSIS",
  HEARTRATE = "HEARTRATE",
  PRESSURE = "PRESSURE",
  SPIRO = "SPIRO",
  EKG = "EKG",
  INJECTION = "INJECTION",
  OPERATION = "OPERATION",
  USG = "USG",
  RTG = "RTG",
  CT = "CT",
  OTHER = "OTHER",
}

export interface WardDetails {
  name: Scalars["String"];
}

export enum WeekDay {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export enum WoundHealingStatus {
  CORRECT = "CORRECT",
  UNDER_SCAB = "UNDER_SCAB",
  WITHOUT_SCAB = "WITHOUT_SCAB",
}

export type ValidateSkuQueryVariables = Exact<{
  sku: Scalars["String"];
}>;

export interface ValidateSkuQuery {
  validateSku: boolean;
}

export const ValidateSkuDocument = gql`
  query ValidateSku($sku: String!) {
    validateSku(sku: $sku)
  }
`;

/**
 * __useValidateSkuQuery__
 *
 * To run a query within a React component, call `useValidateSkuQuery` and pass it any options that fit your needs.
 * When your component renders, `useValidateSkuQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValidateSkuQuery({
 *   variables: {
 *      sku: // value for 'sku'
 *   },
 * });
 */
export function useValidateSkuQuery(
  baseOptions: Apollo.QueryHookOptions<
    ValidateSkuQuery,
    ValidateSkuQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ValidateSkuQuery, ValidateSkuQueryVariables>(
    ValidateSkuDocument,
    options,
  );
}
export function useValidateSkuLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ValidateSkuQuery,
    ValidateSkuQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ValidateSkuQuery, ValidateSkuQueryVariables>(
    ValidateSkuDocument,
    options,
  );
}
export type ValidateSkuQueryHookResult = ReturnType<typeof useValidateSkuQuery>;
export type ValidateSkuLazyQueryHookResult = ReturnType<
  typeof useValidateSkuLazyQuery
>;
export type ValidateSkuQueryResult = Apollo.QueryResult<
  ValidateSkuQuery,
  ValidateSkuQueryVariables
>;
