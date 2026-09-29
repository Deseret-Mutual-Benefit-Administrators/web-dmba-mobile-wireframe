/**
 * Ionicons → lucide-react. The app renders `<Ionicons name="chevron-forward" size color />`;
 * ported code renders `<Icon name="chevron-forward" size color />` with the same names.
 * The map covers every Ionicons name used in the UI extract. An unknown name falls
 * back to `Circle` so a missing mapping is visible rather than a crash.
 * `-outline` / `-sharp` suffixes are stripped when the exact name is not mapped.
 */
import {
  Activity, Archive, ArrowDown, ArrowDownCircle, ArrowLeft, ArrowLeftRight, ArrowRight, ArrowUp,
  Award, Bandage, Banknote, Barcode, BarChart3, Bell, Building2, Calculator, Calendar, CalendarDays,
  Camera, Check, CheckCheck, CheckCircle, CheckSquare, ChevronDown, ChevronLeft, ChevronRight,
  ChevronUp, Circle, CircleAlert, CircleHelp, CirclePlus, CircleX, Clock, CloudOff, Code, Compass,
  Copy, CreditCard, Download, HeartPulse, Ellipsis, ExternalLink, Eye, EyeOff, File, FilePlus, FileText,
  Fingerprint, Flag, FlaskConical, Glasses, Globe, GraduationCap, Headphones, Heart, Home, Hourglass,
  Image, Images, Info, Key, Link, List, Lock, LogOut, Mail, MailOpen, MapPin, Map as MapIcon, Maximize2,
  Menu, MessageCircle, MessageCircleMore, Minus, Navigation, Paperclip, Pencil, Phone, Plus, Receipt,
  RefreshCw, ScanLine, Search, Send, Settings, Share, Share2, Shield, ShieldCheck, Smartphone, Smile,
  Square, Star, StarHalf, Asterisk, Store, BriefcaseMedical, TrendingUp, TriangleAlert, Undo2, User,
  Users, Wallet, X, MailWarning, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  add: Plus,
  "add-circle": CirclePlus,
  alert: TriangleAlert,
  "alert-circle": CircleAlert,
  analytics: BarChart3,
  archive: Archive,
  "arrow-back": ArrowLeft,
  "arrow-down-circle": ArrowDownCircle,
  "arrow-down": ArrowDown,
  "arrow-forward": ArrowRight,
  "arrow-undo": Undo2,
  "arrow-up": ArrowUp,
  attach: Paperclip,
  bandage: Bandage,
  "bar-chart": BarChart3,
  barcode: Barcode,
  business: Building2,
  calculator: Calculator,
  calendar: Calendar,
  call: Phone,
  camera: Camera,
  card: CreditCard,
  cash: Banknote,
  "chatbubble-ellipses": MessageCircleMore,
  chatbubble: MessageCircle,
  checkbox: CheckSquare,
  checkmark: Check,
  "checkmark-circle": CheckCircle,
  "checkmark-done-circle": CheckCheck,
  "chevron-back": ChevronLeft,
  "chevron-down": ChevronDown,
  "chevron-forward": ChevronRight,
  "chevron-up": ChevronUp,
  close: X,
  "close-circle": CircleX,
  "cloud-offline": CloudOff,
  "code-slash": Code,
  compass: Compass,
  copy: Copy,
  create: Pencil,
  "document-attach": FilePlus,
  document: File,
  "document-text": FileText,
  download: Download,
  ellipse: Circle,
  "ellipsis-horizontal": Ellipsis,
  expand: Maximize2,
  "eye-off": EyeOff,
  eye: Eye,
  "finger-print": Fingerprint,
  fitness: HeartPulse,
  flag: Flag,
  flask: FlaskConical,
  glasses: Glasses,
  globe: Globe,
  happy: Smile,
  headset: Headphones,
  heart: Heart,
  "help-circle": CircleHelp,
  home: Home,
  hourglass: Hourglass,
  image: Image,
  images: Images,
  information: Info,
  "information-circle": Info,
  key: Key,
  link: Link,
  list: List,
  location: MapPin,
  "lock-closed": Lock,
  "log-out": LogOut,
  "mail-open": MailOpen,
  mail: Mail,
  "mail-unread": MailWarning,
  map: MapIcon,
  medical: Asterisk,
  medkit: BriefcaseMedical,
  navigate: Navigation,
  notifications: Bell,
  open: ExternalLink,
  people: Users,
  person: User,
  "phone-portrait": Smartphone,
  receipt: Receipt,
  refresh: RefreshCw,
  remove: Minus,
  "reorder-three": Menu,
  ribbon: Award,
  scan: ScanLine,
  school: GraduationCap,
  search: Search,
  send: Send,
  settings: Settings,
  share: Share,
  "share-social": Share2,
  "shield-checkmark": ShieldCheck,
  shield: Shield,
  square: Square,
  "star-half": StarHalf,
  star: Star,
  storefront: Store,
  "swap-horizontal": ArrowLeftRight,
  sync: RefreshCw,
  time: Clock,
  today: CalendarDays,
  "trending-up": TrendingUp,
  wallet: Wallet,
  warning: TriangleAlert,
};

export function resolveIcon(name: string): LucideIcon {
  return ICONS[name] ?? ICONS[name.replace(/-(outline|sharp)$/, "")] ?? Circle;
}

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  /** Icons are decorative by default; the surrounding control carries the label. */
  "aria-label"?: string;
}

export function Icon({ name, size = 24, color = "currentColor", className, "aria-label": ariaLabel }: IconProps) {
  const Glyph = resolveIcon(name);
  return (
    <Glyph
      size={size}
      color={color}
      className={["shrink-0", className ?? ""].filter(Boolean).join(" ")}
      strokeWidth={2}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
    />
  );
}
