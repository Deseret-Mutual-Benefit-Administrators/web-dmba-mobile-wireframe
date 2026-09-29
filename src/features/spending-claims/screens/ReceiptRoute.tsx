/**
 * Port of `app/receipt/[fileKey].tsx`. A non-numeric or non-positive key is a
 * bad link. Wireframe-only: the route list's sample key `sample-receipt` opens
 * placeholder receipt 1001 so the sample URL shows a receipt.
 */
import { useParams } from "react-router-dom";
import { ReceiptViewerScreen } from "./ReceiptViewerScreen";

const SAMPLE_KEY = "sample-receipt";
const SAMPLE_FILE_KEY = 1001;

export function ReceiptRoute() {
  const { fileKey: raw } = useParams<{ fileKey?: string }>();

  const parsed = Number.parseInt(raw ?? "", 10);
  const fileKey = raw === SAMPLE_KEY ? SAMPLE_FILE_KEY : Number.isFinite(parsed) && parsed > 0 ? parsed : null;

  return <ReceiptViewerScreen fileKey={fileKey} />;
}
