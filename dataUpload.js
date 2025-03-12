import {client} from './config.js';

document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const email = formData.get('email');
  const fname = formData.get('fname');
  const lname = formData.get('lname');
  const phone = formData.get('phone');

  const { data: existingUser, error: fetchError } = await client
    .from('userDetails')
    .select('email')
    .eq('email', email)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "No results found" error
    console.error(fetchError);
    alert('❌ Error checking existing users');
    return;
  }

  if (existingUser) {
    alert('⚠️ User already registered with this email!');
    return;
  }
  
  // ✅ Fix: Access file directly from input[type=file]
  const profile = document.querySelector('input[name="profile"]').files[0];

  // ✅ Check if file was uploaded
  if (!profile) {
    alert('❌ Please upload a profile picture');
    return;
  }

  // ✅ Upload the profile picture to Supabase Storage
  const fileExt = profile.name.split('.').pop();
  const fileName = `profile_${email}.${fileExt}`;
  
  const { data, error } = await client.storage
    .from('profile-pictures')
    .upload(fileName, profile, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error(error);
    alert('❌ Failed to upload profile picture');
    return;
  }

  // ✅ Get Public URL
  const profileUrl = `https://ftwgddzkcucwensbcnap.supabase.co/storage/v1/object/public/profile-pictures/${fileName}`;

  // ✅ Insert Data into Supabase Table
  const { data: insertData, error: insertError } = await client
    .from('userDetails')
    .insert([
      {
        email,
        fname,
        lname,
        phone,
        profile_url: profileUrl,
      },
    ]);

  if (insertError) {
    console.error(insertError);
    alert('❌ Failed to create ID card');
    return;
  }

  alert('✅ ID Card Created Successfully');
  e.target.reset();
});