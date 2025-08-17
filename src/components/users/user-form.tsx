// src/components/users/user-form.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, EyeOff } from "lucide-react";

import {
  type RoleCode,
  userCreateSchema,
  userUpdateSchema,
  type UserCreateValues,
  type UserUpdateValues,
  NAME_MAX,
  PASSWORD_MIN,
} from "@/lib/users/schema";

/* =========================
   公開インターフェース（型）
   ========================= */

export type RoleOption = { value: RoleCode; label: string };

type BaseProps = {
  roleOptions: RoleOption[];
  onCancel?: () => void;
  onDelete?: () => void;
};

type CreateProps = BaseProps & {
  mode: "create";
  onSubmit: (values: UserCreateValues) => void;
  initialValues?: never;
};

type EditProps = BaseProps & {
  mode: "edit";
  onSubmit: (values: UserUpdateValues) => void;
  // 読み取り専用 displayId を含む完全な初期値を推奨
  initialValues: UserUpdateValues;
};

type Props = CreateProps | EditProps;

/* =========================
   エクスポート本体
   ========================= */

export default function UserForm(props: Props) {
  return props.mode === "create" ? (
    <CreateForm {...props} />
  ) : (
    <EditForm {...props} />
  );
}

/* =========================
   Create（新規）フォーム
   ========================= */

function CreateForm({ roleOptions, onSubmit, onCancel }: CreateProps) {
  const form = useForm<UserCreateValues>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: { name: "", email: "", password: "", isActive: true },
    mode: "onBlur",
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form data-testid="user-form-create" onSubmit={handleSubmit}>
        <Card className="w-full rounded-md">
          <CardContent className="space-y-6 pt-1">
            <NameField />
            <EmailField />
            <RoleField roleOptions={roleOptions} />
            <PasswordField />
            <IsActiveField />
          </CardContent>

          <CardFooter className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              data-testid="cancel-btn"
              className="cursor-pointer"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              data-testid="submit-create"
              className="cursor-pointer"
              disabled={form.formState.isSubmitting}
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
   Edit（編集）フォーム
   ========================= */

function EditForm({
  roleOptions,
  onSubmit,
  onCancel,
  onDelete,
  initialValues,
}: EditProps) {
  const form = useForm<UserUpdateValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form data-testid="user-form-edit" onSubmit={handleSubmit}>
        <Card className="w-full rounded-md">
          <CardContent className="space-y-6 pt-1">
            <DisplayIdField />
            <Separator />
            <NameField />
            <EmailField />
            <RoleField roleOptions={roleOptions} />
            <IsActiveField />
          </CardContent>

          <CardFooter className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                data-testid="cancel-btn"
                className="cursor-pointer"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                data-testid="submit-update"
                className="cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                更新する
              </Button>
            </div>
            {/* onDelete が渡っている時だけ表示 */}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    data-testid="delete-open"
                    className="cursor-pointer"
                  >
                    削除する
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      ユーザを論理削除しますか？
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      この操作は DB では <code>deletedAt</code>{" "}
                      を設定する「論理削除」です。
                      一覧からは非表示になります（復活は別途機能で対応）。
                    </AlertDialogDescription>
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
   小さなフィールド群（同ファイル内）
   - RHF の form は Form コンポーネントから context 供給済み
   - FormField は useForm の control を内部取得
   ========================= */

// 氏名
function NameField() {
  return (
    <FormField
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">氏名&nbsp;*</FormLabel>
          <FormControl>
            <Input
              {...field}
              inputMode="text"
              placeholder="山田 太郎"
              maxLength={NAME_MAX}
              aria-label="氏名"
              autoComplete="off"
              data-testid="name"
            />
          </FormControl>
          <FormMessage data-testid="name-error" />
        </FormItem>
      )}
    />
  );
}

// メール
function EmailField() {
  return (
    <FormField
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">メールアドレス&nbsp;*</FormLabel>
          <FormControl>
            <Input
              type="email"
              {...field}
              placeholder="user@example.com"
              aria-label="メールアドレス"
              autoComplete="off"
              data-testid="email"
            />
          </FormControl>
          <FormMessage data-testid="email-error" />
        </FormItem>
      )}
    />
  );
}

// ロール
function RoleField({ roleOptions }: { roleOptions: RoleOption[] }) {
  return (
    <FormField
      name="roleCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">ロール&nbsp;*</FormLabel>
          <Select
            name={field.name}
            value={field.value ?? ""}
            onValueChange={(v) => field.onChange(v as RoleCode)}
          >
            <FormControl>
              <SelectTrigger
                aria-label="ロールを選択"
                data-testid="role-trigger"
              >
                <SelectValue
                  placeholder="選択してください"
                  data-testid="role-value"
                />
              </SelectTrigger>
            </FormControl>
            {/* Portal配下でも拾えるようにリスト自体に testid を付与 */}
            <SelectContent data-testid="role-list">
              {roleOptions.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  data-testid={`role-item-${opt.value.toLowerCase()}`}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage data-testid="roleCode-error" />
        </FormItem>
      )}
    />
  );
}

// パスワード（新規のみ・表示/非表示トグル付き）
function PasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <FormField
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">パスワード&nbsp;*</FormLabel>
          <div className="flex items-start gap-2">
            <FormControl>
              <Input
                {...field}
                data-testid="password"
                type={showPassword ? "text" : "password"}
                autoComplete="off"
                placeholder={`${PASSWORD_MIN}文字以上（英大/小/数字を含む）`}
                aria-label="パスワード"
              />
            </FormControl>

            <Button
              data-testid="password-toggle"
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword
                  ? "パスワードを非表示にする"
                  : "パスワードを表示する"
              }
              className="shrink-0 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
          <FormMessage data-testid="password-error" />
        </FormItem>
      )}
    />
  );
}

// 有効フラグ
function IsActiveField() {
  return (
    <FormField
      name="isActive"
      render={({ field }) => (
        <FormItem className="mt-4 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel className="font-semibold">有効&nbsp;*</FormLabel>
            <FormDescription>
              ONにすると有効/OFFにすると無効になります
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              name={field.name}
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              aria-label="有効フラグ"
              data-testid="isActive"
            />
          </FormControl>
          <FormMessage data-testid="isActive-error" />
        </FormItem>
      )}
    />
  );
}

// 表示ID（編集のみ・読み取り専用）
function DisplayIdField() {
  return (
    <FormField
      name="displayId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>表示ID</FormLabel>
          <FormControl>
            <Input
              {...field}
              readOnly
              aria-readonly="true"
              data-testid="displayId"
            />
          </FormControl>
          <FormDescription data-testid="displayId-desc">
            DBで自動採番される表示用IDです（編集不可）。
          </FormDescription>
          <FormMessage data-testid="displayId-error" />
        </FormItem>
      )}
    />
  );
}
