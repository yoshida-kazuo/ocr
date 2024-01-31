import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {}
            },
            ja: {
                translation: {
                    "Forgot your password?": "パスワードを忘れましたか？",
                    "Remember me": "ログイン状態を保存",
                    "Log in": "ログイン",
                    "Login ID": "ログインID",
                    "Password": "パスワード",
                    "Email": "eメールアドレス",
                    "Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.": "パスワードを忘れましたか？問題ありません。メールアドレスをお知らせいただければ、新しいパスワードを選択できるリセットリンクをメールでお送りします。",
                    "Email Password Reset Link": "パスワード再設定用メール送信",
                    "Name": "お名前",
                    "Register": "登録",
                    "Cancel": "キャンセル",
                    "Log Out": "ログアウト",
                    "Confirm Password": "パスワード確認",
                    "Already registered?": "すでに登録済みですか？",
                    "Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.": "サインアップしていただきありがとうございます！始める前に、私たちがあなたに送ったメール内のリンクをクリックして、メールアドレスを確認していただけますか？もしメールが届いていない場合は、喜んで別のメールをお送りします。",
                    "Profile": "プロフィール",
                    "Profile edit": "プロフィール更新",
                    "Log out": "ログアウト",
                    "Dashboard": "ダッシュボード",
                    "Profile Information": "プロフィール情報",
                    "New Register": "新規登録",
                    "Your email address is unverified.": "あなたのメールアドレスは未確認です。",
                    "Click here to resend the confirmation email.": "確認メールを再送するにはこちらをクリックしてください。",
                    "A new confirmation link has been sent to your email address.": "新しい確認リンクがあなたのメールアドレスに送信されました。",
                    "You have been registered.": "登録しました。",
                    "Update Password": "パスワード更新",
                    "To ensure the security of your account, please use a long and random password.": "アカウントの安全を保つために、長くランダムなパスワードを使用してください。",
                    "Current Password": "現在のパスワード",
                    "New Password": "新しいパスワード",
                    "Delete Account": "アカウント削除",
                    "When the account is deleted, all of its resources and data will be permanently removed.": "アカウントが削除されると、そのすべてのリソースとデータは完全に削除されます。",
                    "Before deleting your account, please download any data or information you want to save.": "アカウントを削除する前に、保存しておきたいデータや情報をダウンロードしてください。",
                    "To confirm the permanent deletion of your account, please enter your password.": "アカウントを永久に削除することを確認するために、パスワードを入力してください。",
                    "Are you sure you want to delete your account?": "本当にアカウントを削除しますか？",
                    "Failed to retrieve a list of time zones.": "タイムゾーン一覧の取得に失敗",
                    "Failed to set the time zone": "タイムゾーンの設定に失敗",
                    "Registration datetime": "登録日時",
                    "Type": "タイプ",
                    "Message": "メッセージ",
                    "Activity": "操作ログ",
                    "User": "ユーザ",
                    "Home Page": "ホーム",
                    "Contact": "お問い合わせ",
                    "I have sent it.": "送信しました。",
                    "Send": "送信",
                    "Please enter the inquiry details.": "お問い合わせ内容を入力して下さい。",
                    "Register Here for New Account": "新規登録はこちら",
                    "Last Updated": "更新日時",
                    "Role": "権限",
                    "User management": "ユーザ管理",
                    "User information": "ユーザ情報",
                    "Deleted At": "削除日時",
                    "Restore Account": "削除取消",
                    "Removed": "削除済み",
                    "Login prohibition time/date": "ログイン禁止日時",
                    "Login prohibited": "ログイン禁止",
                    "Login permitted": "ログイン許可",
                    "Login prohibition status": "ログイン禁止状態",
                    "The deletion flag has been removed.": "削除フラグを解除しました。",
                    "The account has been deleted.": "アカウントが削除されました。",
                    "This account has been banned from logging in.": "このアカウントはログインを禁止されています。",
                    "Resend Verification Email": "確認メールを再送信",
                    "A new verification link has been sent to the email address you provided during registration.": "登録時に提供されたメールアドレスに新しい確認リンクが送信されました。",
                    "Please complete email verification.": "メール認証を完了してください。",
                    "Create User": "ユーザ作成",
                    "Please register your email address.": "メールアドレスを登録してください。",
                    "The displayed email address is the one that was used during registration. To use the application comfortably, please register a new email address.": "表示されているメールアドレスは登録時に使用されたものです。アプリケーションを快適に利用するには新しいメールアドレスを登録してください。",
                    "You do not have execution permission.": "実行権限がありません。",
                    "An error has occurred. Please try reloading.": "エラーが発生しています。再読み込みを実施してみてください。",
                    "Close": "閉じる",
                    "Delete": "削除",
                    "Do you want to delete?": "削除しますか？"
                }
            }
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
