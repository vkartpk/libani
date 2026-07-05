## Plan

1. **Add “Forgot password?” to the sign-in form**
   - Show a small link/button under the password field on `/auth`.
   - When clicked, switch the card into a password-recovery view.

2. **Send reset email for `info@vkart.pk` or any entered email**
   - Add a simple email field and “Send reset link” button.
   - Use the backend auth reset flow with redirect to `/reset-password`.
   - Show a clear success message: check your email for the reset link.

3. **Improve the reset-password page**
   - Keep `/reset-password` public.
   - Validate the new password before submitting.
   - Show helpful messages if the reset link is invalid/expired.
   - After password update, send the user back to `/auth` or account page.

4. **Keep login credentials secure**
   - I cannot recover or display the old password because it is not stored in readable form.
   - Your login email is `info@vkart.pk`; the new reset flow will let you create a new password safely.

## Technical details

- Update `src/pages/Auth.tsx` to add a recovery mode and call `resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' })`.
- Update `src/pages/ResetPassword.tsx` to handle recovery-link state more cleanly and call `updateUser({ password })`.
- No database changes needed.