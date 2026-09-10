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
        "flex max-w-full min-w-0 items-center gap-[0.35em] leading-none",
        className
      )}
    >
      {logo ? (
        <img
          src={logo}
          alt=""
          className="block shrink-0 object-contain"
          style={{ width: "1.15em", height: "1.15em" }}
        />
      ) : null}
      <span className="truncate leading-none">{title}</span>
    </span>
  );
};

export default ItemHeading;
