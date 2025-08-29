// src/components/menus/menu-form.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  menuCreateSchema,
  menuUpdateSchema,
  type MenuCreateValues,
  type MenuUpdateValues,
  type MatchMode,
} from "@/lib/sidebar/menu.schema";
import type { LucideIcon } from "lucide-react";
import { ICONS } from "@/lib/sidebar/icons.map";

export type ParentOption = { value: string | null; label: string };
export type IconOption = { value: string; label: string };

type BaseProps = {
  parentOptions: ParentOption[]; // 先頭に {value:null,label:"(ルート)"} を含める
  iconOptions: IconOption[]; // 先頭は {value:"",label:"(なし)"} ではなく value を与えない ⇒ 未選択は undefined で保持
  onCancel?: () => void;
  onDelete?: () => void;
};

type CreateProps = BaseProps & {
  mode: "create";
  onSubmit: (values: MenuCreateValues) => void;
  initialValues?: never;
};

type EditProps = BaseProps & {
  mode: "edit";
  onSubmit: (values: MenuUpdateValues) => void;
  initialValues: MenuUpdateValues; // displayId/order を含む完全値
};

type Props = CreateProps | EditProps;

export default function MenuForm(props: Props) {
  return props.mode === "create" ? (
    <CreateForm {...props} />
  ) : (
    <EditForm {...props} />
  );
}

/* =========================
   Create（新規）
   ========================= */
function CreateForm({
  parentOptions,
  iconOptions,
  onSubmit,
  onCancel,
}: CreateProps) {
  // 入力型/出力型（z.input / z.output）でロールと同一パターン
  type Input = z.input<typeof menuCreateSchema>;
  type Values = z.output<typeof menuCreateSchema>;

  const form = useForm<Input, undefined, Values>({
    resolver: zodResolver(menuCreateSchema),
    defaultValues: {
      parentId: null,
      title: "",
      isSection: false,
      href: "",
      match: "prefix",
      pattern: "",
      iconName: undefined,
      minPriority: undefined,
      isActive: true,
    },
    mode: "onBlur",
  });

  const isSection = form.watch("isSection");
  React.useEffect(() => {
    if (isSection) {
      form.setValue("parentId", null, { shouldValidate: true });
      form.setValue("href", undefined, { shouldValidate: true });
      form.setValue("match", "prefix", { shouldValidate: true });
      form.setValue("pattern", undefined, { shouldValidate: true });
    }
  }, [isSection, form]);

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} data-testid="menu-form-create">
        <Card className="w-full rounded-md">
          <CardContent className="space-y-6 pt-1">
            {/* 親候補は SSR 側で getParentOptions() 済をそのまま渡す */}
            <IsSectionField />
            <TitleField />
            {/* セクションでない時だけリンク系を表示 */}
            {form.watch("isSection") ? (
              <IconField iconOptions={iconOptions} />
            ) : (
              <>
                <ParentField parentOptions={parentOptions} />
                <HrefField />
                <MatchField />
                {form.watch("match") === "regex" && <PatternField />}
              </>
            )}

            <MinPriorityField />
            <IsActiveField />
          </CardContent>

          <CardFooter className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="cursor-pointer"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="cursor-pointer"
              data-testid="submit-create"
            >
              登録する
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

/* =========================
   Edit（編集）
   ========================= */
function EditForm({
  parentOptions,
  iconOptions,
  initialValues,
  onSubmit,
  onCancel,
  onDelete,
}: EditProps) {
  type Input = z.input<typeof menuUpdateSchema>;
  type Values = z.output<typeof menuUpdateSchema>;

  const form = useForm<Input, undefined, Values>({
    resolver: zodResolver(menuUpdateSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  // ★ 見出しONならリンク系の値を都度クリア＆既定化
  const isSection = form.watch("isSection");
  React.useEffect(() => {
    if (isSection) {
      form.setValue("parentId", null, { shouldValidate: true });
      form.setValue("href", undefined, { shouldValidate: true });
      form.setValue("match", "prefix", { shouldValidate: true });
      form.setValue("pattern", undefined, { shouldValidate: true });
    }
  }, [isSection, form]);

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} data-testid="menu-form-edit">
        <Card className="w-full rounded-md">
          <CardContent className="space-y-6 pt-1">
            <DisplayIdField />
            <IsSectionField />
            <TitleField />
            {/* セクションでない時だけリンク系を表示 */}
            {form.watch("isSection") ? (
              <IconField iconOptions={iconOptions} />
            ) : (
              <>
                <ParentField parentOptions={parentOptions} />
                <HrefField />
                <MatchField />
                {form.watch("match") === "regex" && <PatternField />}
              </>
            )}
            <MinPriorityField />
            <IsActiveField />
          </CardContent>

          <CardFooter className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="cursor-pointer"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="cursor-pointer"
                data-testid="submit-update"
              >
                更新する
              </Button>
            </div>

            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="cursor-pointer"
                    data-testid="delete-open"
                  >
                    削除する
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      このメニューを論理削除しますか？
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-testid="delete-cancel">
                      キャンセル
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      data-testid="delete-confirm"
                    >
                      削除する
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

/* =========================
   小さなフィールド群
   ========================= */

export function ParentField({
  parentOptions,
}: {
  parentOptions: ParentOption[];
}) {
  // (ルート) を除外して、深さ判定のための簡易データを作る
  const options = React.useMemo(
    () =>
      parentOptions
        .filter((o) => o.value !== null) // ★ ここで(ルート)を排除
        .map((o) => ({
          value: o.value!, // null は除外済み
          label: o.label,
          depth: o.label.startsWith("　└ ") ? 1 : 0,
        })),
    [parentOptions],
  );

  return (
    <FormField
      name="parentId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">親メニュー&nbsp;*</FormLabel>
          <Select
            name={field.name}
            // 未選択は undefined にして placeholder を出す
            value={field.value ?? undefined}
            onValueChange={(v) => field.onChange(v)}
          >
            <FormControl>
              <SelectTrigger
                aria-label="親メニューを選択"
                data-testid="parent-trigger"
              >
                <SelectValue
                  placeholder="選択してください"
                  data-testid="parent-value"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent data-testid="parent-list">
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className={opt.depth === 1 ? "pl-4" : ""}>
                    {opt.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage data-testid="parentId-error" />
        </FormItem>
      )}
    />
  );
}

function TitleField() {
  return (
    <FormField
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">タイトル&nbsp;*</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="メニュー名"
              aria-label="タイトル"
              data-testid="title"
            />
          </FormControl>
          <FormMessage data-testid="title-error" />
        </FormItem>
      )}
    />
  );
}

function IsSectionField() {
  return (
    <FormField
      name="isSection"
      render={({ field }) => (
        <FormItem className="mt-1 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <FormLabel className="font-semibold">
            見出し（トップレベル）&nbsp;*
          </FormLabel>
          <FormControl>
            <Switch
              name={field.name}
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              aria-label="見出しフラグ"
              data-testid="isSection"
            />
          </FormControl>
          <FormMessage data-testid="isSection-error" />
        </FormItem>
      )}
    />
  );
}

function HrefField() {
  return (
    <FormField
      name="href"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">
            URL（先頭/、末尾/なし）*
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="/masters"
              aria-label="URL"
              data-testid="href"
            />
          </FormControl>
          <FormMessage data-testid="href-error" />
        </FormItem>
      )}
    />
  );
}

function MatchField() {
  const modes: { value: MatchMode; label: string }[] = [
    { value: "prefix", label: "前方一致（既定）" },
    { value: "exact", label: "完全一致" },
    { value: "regex", label: "正規表現" },
  ];
  return (
    <FormField
      name="match"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">URL一致 *</FormLabel>
          <Select
            name={field.name}
            value={field.value ?? "prefix"}
            onValueChange={(v) => field.onChange(v as MatchMode)}
          >
            <FormControl>
              <SelectTrigger aria-label="一致方法" data-testid="match-trigger">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
            </FormControl>
            <SelectContent data-testid="match-list">
              {modes.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage data-testid="match-error" />
        </FormItem>
      )}
    />
  );
}

function PatternField() {
  return (
    <FormField
      name="pattern"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">正規表現</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="^/reports/[0-9]+$"
              aria-label="正規表現"
              data-testid="pattern"
            />
          </FormControl>
          <FormDescription className="text-xs">
            `match = regex` の時だけ使用。その他では未入力にしてください。
          </FormDescription>
          <FormMessage data-testid="pattern-error" />
        </FormItem>
      )}
    />
  );
}

function IconField({ iconOptions }: { iconOptions: IconOption[] }) {
  return (
    <FormField
      name="iconName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">アイコン</FormLabel>
          <Select
            name={field.name}
            // 未選択は undefined を保持（空文字は使わない）
            value={field.value ?? "___NONE___"}
            onValueChange={(v) =>
              field.onChange(v === "___NONE___" ? undefined : v)
            }
          >
            <FormControl>
              <SelectTrigger aria-label="アイコン" data-testid="icon-trigger">
                <SelectValue placeholder="（なし）" />
              </SelectTrigger>
            </FormControl>

            <SelectContent data-testid="icon-list">
              <SelectItem value="___NONE___">（なし）</SelectItem>

              {iconOptions.map((opt) => {
                // ★ 動的 JSX は不可。まず変数に代入してから使う
                const Icon = ICONS[opt.value] as LucideIcon | undefined;
                return (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="flex items-center gap-2">
                      {Icon ? (
                        <Icon className="text-foreground size-4" />
                      ) : null}
                      <span>{opt.label}</span>
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FormMessage data-testid="iconName-error" />
        </FormItem>
      )}
    />
  );
}

function MinPriorityField() {
  return (
    <FormField
      name="minPriority"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">可視しきい値</FormLabel>
          <FormControl>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={
                field.value === undefined || field.value === null
                  ? ""
                  : String(field.value)
              }
              onChange={(e) => {
                const v = e.target.value;
                field.onChange(v === "" ? undefined : Number(v));
              }}
              placeholder="未選択（全員表示）"
              aria-label="可視しきい値"
              data-testid="minPriority"
            />
          </FormControl>
          <FormDescription className="text-xs">
            未入力＝全員に表示。指定すると「この値以上のロール」に表示します。
          </FormDescription>
          <FormMessage data-testid="minPriority-error" />
        </FormItem>
      )}
    />
  );
}

function IsActiveField() {
  return (
    <FormField
      name="isActive"
      render={({ field }) => (
        <FormItem className="mt-1 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <FormLabel className="font-semibold">有効&nbsp;*</FormLabel>
          <FormControl>
            <Switch
              name={field.name}
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              aria-label="有効"
              data-testid="isActive"
            />
          </FormControl>
          <FormMessage data-testid="isActive-error" />
        </FormItem>
      )}
    />
  );
}

function DisplayIdField() {
  return (
    <FormField
      name="displayId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">表示ID</FormLabel>
          <FormControl>
            <Input
              {...field}
              readOnly
              aria-readonly="true"
              data-testid="displayId"
              className="bg-muted text-muted-foreground border-none focus-visible:ring-0"
            />
          </FormControl>
          <FormMessage data-testid="displayId-error" />
        </FormItem>
      )}
    />
  );
}
