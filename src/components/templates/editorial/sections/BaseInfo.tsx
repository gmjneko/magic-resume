import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { BasicInfo, GlobalSettings, getBorderRadiusValue } from "@/types/resume";
import SectionWrapper from "../../shared/SectionWrapper";
import { getBasicInfoPhotoSize, getBasicInfoSpacing } from "@/lib/basicInfoSpacing";
import { BasicInfoPhoto } from "../../shared/BasicInfoPhoto";
import { formatDateString } from "@/lib/utils";
import { useLocale, useTranslations } from "@/i18n/compat/client";
import { getCustomFieldDisplayText, getCustomFieldHref, shouldShowCustomFieldLabelPrefix } from "@/lib/customField";
import { shouldShowFieldLabel } from "@/lib/fieldDisplay";

interface BaseInfoProps {
  basic: BasicInfo;
  globalSettings?: GlobalSettings;
}

const BaseInfo: React.FC<BaseInfoProps> = ({ basic, globalSettings }) => {
  const locale = useLocale();
  const t = useTranslations("workbench");
  const isNameTop = basic.layout === "nameTop";
  const basicInfoSpacing = getBasicInfoSpacing(globalSettings?.basicInfoLineHeight);

  const getOrderedFields = React.useMemo(() => {
    if (!basic.fieldOrder) {
      return [
        { key: "email", value: basic.email, custom: false, label: "" },
        { key: "phone", value: basic.phone, custom: false, label: "" },
        { key: "location", value: basic.location, custom: false, label: "" },
      ].filter((f) => !!f.value);
    }
    return basic.fieldOrder
      .filter((field) => field.visible !== false && field.key !== "name" && field.key !== "title")
      .map((field) => ({
        key: field.key,
        value: field.key === "birthDate" && basic[field.key] ? formatDateString(basic[field.key] as string, locale) : (basic[field.key] as string),
        label: field.label,
        custom: false,
        displayLabel: field.displayLabel,
      }))
      .filter((item) => !!item.value);
  }, [basic, locale]);

  const customFields =
    basic.customFields?.filter(
      (f) => f.visible !== false && Boolean(getCustomFieldDisplayText(f))
    ) || [];

  const allFields = [
    ...getOrderedFields,
    ...customFields.map((f) => ({
      key: f.id,
      value: getCustomFieldDisplayText(f),
      custom: true,
      label: f.label,
      icon: f.icon,
      displayLabel: f.displayLabel,
      href: getCustomFieldHref(f),
    })),
  ];

  const nameField = basic.fieldOrder?.find((f) => f.key === "name") || { visible: true };
  const titleField = basic.fieldOrder?.find((f) => f.key === "title") || { visible: true };

  const getIcon = (iconName: string | undefined) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ElementType;
    return IconComponent ? <IconComponent className="h-[0.9em] w-[0.9em] shrink-0" /> : null;
  };

  const showPhoto = basic.photo && basic.photoConfig?.visible;

  const photoNode = showPhoto && (
    <motion.div layout="position" className="shrink-0">
      <div
        style={{
          width: `${getBasicInfoPhotoSize(basic.photoConfig?.width, 100, globalSettings?.basicInfoLineHeight)}px`,
          height: `${getBasicInfoPhotoSize(basic.photoConfig?.height, 100, globalSettings?.basicInfoLineHeight)}px`,
          borderRadius: getBorderRadiusValue(basic.photoConfig || { borderRadius: "none", customBorderRadius: 0 }),
          overflow: "hidden",
        }}
      >
        <img src={basic.photo} alt={`${basic.name}'s photo`} className="w-full h-full object-cover" />
      </div>
    </motion.div>
  );

  const nameNode = basic.name && nameField.visible !== false && (
    <motion.h1
      layout="position"
      className="font-bold tracking-widest whitespace-normal break-normal [overflow-wrap:normal] text-black"
      style={{ fontSize: `${(globalSettings?.headerSize || 20) * (isNameTop ? 1.6 : 2)}px`, lineHeight: "1.1", marginBottom: "8px" }}
    >
      {basic.name}
    </motion.h1>
  );

  const fieldsNode = (
    <motion.div
      layout="position"
      className={
        isNameTop
          ? "flex flex-wrap items-center justify-start gap-x-6 gap-y-2 uppercase tracking-[0.05em] text-gray-500"
          : "flex flex-wrap items-center justify-end gap-x-6 gap-y-2 uppercase tracking-[0.05em] text-gray-500 w-[80%] flex-shrink-0"
      }
      style={{ fontSize: `${globalSettings?.baseFontSize || 14}px`, ...basicInfoSpacing }}
    >
      {allFields.map((item) => {
        const customFieldHref =
          item.custom && "href" in item && typeof item.href === "string"
            ? item.href
            : null;
        const useIconMode = globalSettings?.useIconMode ?? false;
        const showLabel = item.custom
          ? shouldShowCustomFieldLabelPrefix(item, useIconMode)
          : shouldShowFieldLabel(item.displayLabel, useIconMode);
        const labelText = item.custom ? item.label : t(`basicPanel.basicFields.${item.key}`);
        const labelPrefix = showLabel && labelText ? `${labelText}: ` : "";

        return (
          <div key={item.key} className="flex items-center gap-2">
            {useIconMode && (
              <span className="inline-flex shrink-0 text-gray-400">
                {getIcon(item.custom ? (item as any).icon : basic.icons?.[item.key as keyof typeof basic.icons])}
              </span>
            )}
            <div className="min-w-0">
              {item.key === "email" ? (
                <a href={`mailto:${item.value}`} className="block min-w-0 transition-colors [overflow-wrap:anywhere] hover:text-black">
                  {labelPrefix}
                  {item.value}
                </a>
              ) : item.key === "website" || item.key === "github" ? (
                <a href={item.value.startsWith("http") ? item.value : `https://${item.value}`} className="block min-w-0 transition-colors [overflow-wrap:anywhere] hover:text-black">
                  {labelPrefix}
                  {item.value.replace(/^https?:\/\//, "")}
                </a>
              ) : customFieldHref ? (
                <a href={customFieldHref} target="_blank" rel="noopener noreferrer" className="block min-w-0 no-underline transition-colors [overflow-wrap:anywhere] hover:text-black">
                  {labelPrefix}
                  {item.value}
                </a>
              ) : (
                <span className="block min-w-0 [overflow-wrap:anywhere]">
                  {labelPrefix}
                  {item.value}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </motion.div>
  );

  if (isNameTop) {
    return (
      <SectionWrapper sectionId="basic" className=" w-full">
        <div className="flex items-stretch justify-between gap-6 w-full">
          <div className="flex min-w-0 flex-1 flex-col">
            {nameNode}
            <div style={basicInfoSpacing ? { marginTop: basicInfoSpacing.rowGap } : undefined} className={basicInfoSpacing ? undefined : "mt-2"}>{fieldsNode}</div>
          </div>
          <BasicInfoPhoto
            src={basic.photo}
            alt={`${basic.name}'s photo`}
            width={getBasicInfoPhotoSize(basic.photoConfig?.width, 100, globalSettings?.basicInfoLineHeight)}
            height={getBasicInfoPhotoSize(basic.photoConfig?.height, 100, globalSettings?.basicInfoLineHeight)}
            config={basic.photoConfig}
            fitBlock
          />
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper sectionId="basic" className=" w-full">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            {nameNode}
          </div>
          {photoNode}
        </div>

        <div className="w-full h-[3px] my-4" style={{ backgroundColor: globalSettings?.themeColor || "#000" }} />

        <div className="flex justify-between items-start mt-10 w-full">
          {basic.title && titleField.visible !== false && (
            <div className="flex-1 min-w-[100px] shrink-0">
              <motion.h2
                layout="position"
                className="font-normal tracking-wide text-gray-700 whitespace-normal break-normal [overflow-wrap:normal]"
                style={{ fontSize: `${globalSettings?.subheaderSize || 16}px`, lineHeight: "1.3" }}
              >
                {basic.title}
              </motion.h2>
            </div>
          )}
          {fieldsNode}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default BaseInfo;
