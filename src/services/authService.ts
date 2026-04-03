import { supabase } from "../lib/supabaseClient";

export type Role = "seeker" | "employer";

export interface SignupFormData {
  email: string;
  password: string;
  fname: string;
  lname: string;
  phone: string;
  profession: string;
  location: string;
  emptype: string;
  bio: string;
  company: string;
  industry: string;
  size: string;
  elocation: string;
  terms: boolean;
  marketing: boolean;
}

export interface SignupData {
  form: SignupFormData;
  roles: Role[];
}

export const signUpUser = async ({ form, roles }: SignupData) => {
  // 1. Create the auth user
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
  });

  if (error) {
    return { error: error.message };
  }

  const user = data.user;
  if (!user) {
    return { error: "Signup succeeded but no user was returned. Please try again." };
  }

  // 2. Write the profile row
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,

    email:      form.email,
    first_name: form.fname,
    last_name:  form.lname,
    phone:      form.phone,

    role: roles,

    profession:                  form.profession   || null,
    seeker_location:             form.location     || null,
    employment_type_preference:  form.emptype      || null,
    bio:                         form.bio          || null,

    terms_accepted:    form.terms,
    marketing_consent: form.marketing,
  });

  if (profileError) {
    return { error: `Account created but profile save failed: ${profileError.message}` };
  }

  // 3. If the user is an employer, also seed the companies table with signup data.
  //    Fields not collected at signup (company_email, company_phone, website) are
  //    left null and can be filled in later via the Employer Profile dashboard.
  if (roles.includes("employer") && form.company) {
    const { error: companyError } = await supabase.from("companies").upsert({
      owner_id:         user.id,
      company_name:     form.company   || null,
      industry:         form.industry  || null,
      company_size:     form.size      || null,
      company_location: form.elocation || null,
      company_email:    null,
      company_phone:    null,
      website:          null,
    }, { onConflict: "owner_id" });

    if (companyError) {
      // Non-fatal: profile was created successfully; dashboard can fix this
      console.warn("Company row seed failed:", companyError.message);
    }
  }

  return { 
    data, 
    needsConfirmation: !data.session 
  };
};

export const logInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch the user's role from the profiles table
  const userId = data.session?.user?.id;
  let roles: string[] = [];
  
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    roles = profile?.role ?? [];
  }

  return { data, roles };
};
