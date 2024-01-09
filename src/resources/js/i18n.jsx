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
                    "Top page": "トップページ",
                    "Contact": "お問い合わせ",
                    "I have sent it.": "送信しました。",
                    "Send": "送信",
                    "Please enter the inquiry details.": "お問い合わせ内容を入力して下さい。",
                    "Register Here for New Account": "新規登録はこちら",
                }
            }
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
