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
                    "Log Out": "ログアウト",
                    "Confirm Password": "パスワード確認用",
                    "Already registered?": "すでに登録済みですか？",
                    "Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.": "サインアップしていただきありがとうございます！始める前に、私たちがあなたに送ったメール内のリンクをクリックして、メールアドレスを確認していただけますか？もしメールが届いていない場合は、喜んで別のメールをお送りします。",
                    "Profile edit": "プロフィール更新",
                    "Log out": "ログアウト",
                    "Dashboard": "ダッシュボード",
                }
            }
        },
        fallbackLng: "en",

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
