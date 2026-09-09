import { cn } from "@/lib/utils";

interface CompanyHeadingProps {
  company?: string;
  logo?: string;
  className?: string;
}

const CompanyHeading: React.FC<CompanyHeadingProps> = ({
  company,
  logo,
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 items-center gap-[0.4em]",
        className
      )}
    >
      {logo ? (
        <img
          src={logo}
          alt=""
          className="shrink-0 object-contain"
          style={{ width: "1.35em", height: "1.35em" }}
        />
      ) : null}
      <span className="truncate">{company}</span>
    </span>
  );
};

export default CompanyHeading;
