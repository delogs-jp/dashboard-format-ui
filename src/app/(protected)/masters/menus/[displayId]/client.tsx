// src/app/(protected)/masters/menus/[displayId]/client.tsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import MenuForm from "@/components/menus/menu-form";
import { updateMenu, deleteMenu } from "@/lib/sidebar/menu.mock";
import type { MenuRecord, MenuUpdateValues } from "@/lib/sidebar/menu.schema";
import type { ParentOption, IconOption } from "@/components/menus/menu-form";

type Props = {
  initialValues: MenuUpdateValues;
  parentOptions: ParentOption[];
  iconOptions: IconOption[];
};

export default function EditMenuClient({
  initialValues,
  parentOptions,
  iconOptions,
}: Props) {
  const router = useRouter();

  return (
    <MenuForm
      mode="edit"
      initialValues={initialValues}
      parentOptions={parentOptions}
      iconOptions={iconOptions}
      onSubmit={(values: MenuUpdateValues) => {
        // 更新（親変更や isSection 切り替えも許容）
        const ok = updateMenu({
          displayId: values.displayId,
          parentId: values.isSection ? null : values.parentId,
          order: values.order,
          title: values.title,
          isSection: values.isSection,
          href: values.isSection ? undefined : values.href,
          match: values.isSection ? "prefix" : values.match,
          pattern: values.isSection ? undefined : values.pattern,
          iconName: values.iconName || undefined,
          minPriority: values.minPriority,
          isActive: values.isActive,
        } as MenuRecord);

        if (!ok) {
          toast.error("更新に失敗しました");
          return;
        }

        toast.success("メニューを更新しました", {
          description: `${values.displayId} / ${values.title}`,
        });
        router.push("/masters/menus");
      }}
      onCancel={() => history.back()}
      onDelete={() => {
        const ok = deleteMenu(initialValues.displayId);
        if (!ok) {
          toast.warning("配下にメニューがあるため削除できません");
          return;
        }
        toast.success("メニューを削除しました", {
          description: initialValues.displayId,
        });
        router.push("/masters/menus");
      }}
    />
  );
}
