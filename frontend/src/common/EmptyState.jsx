
import InboxOutlined from "@mui/icons-material/InboxOutlined";

export default function EmptyState({
  title = "No data found",
  description = "There are no records to display.",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <InboxOutlined
        className="text-slate-400"
        sx={{ fontSize: 48 }}
      />

      <h3 className="mt-3 text-lg font-semibold text-ink">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}
