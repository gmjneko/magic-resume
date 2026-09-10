import { cn } from "@/lib/utils";

interface ItemHeadingProps {
  title?: string;
  logo?: string;
  className?: string;
}

const ItemHeading: React.FC<ItemHeadingProps> = ({
  title,
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
      <span className="truncate">{title}</span>
    </span>
  );
};

export default ItemHeading;
