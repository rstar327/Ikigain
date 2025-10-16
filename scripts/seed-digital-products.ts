import { db } from '../server/db';
import { digitalProducts } from '@shared/schema';
import fs from 'fs';
import path from 'path';

async function seedDigitalProducts() {
  try {
    console.log('🌱 Seeding digital products...');
    
    // Ensure server/public directory exists
    const publicDir = path.join(process.cwd(), 'server/public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      console.log('📁 Created server/public directory');
    }

    // Copy PDF file to server/public
    const sourcePdf = path.join(process.cwd(), 'attached_assets', 'Ikigain Cards E version_1755005130927.pdf');
    const targetPdf = path.join(publicDir, 'ikigai-cards-digital.pdf');
    
    if (fs.existsSync(sourcePdf)) {
      fs.copyFileSync(sourcePdf, targetPdf);
      console.log('📄 PDF file copied to server/public');
    } else {
      console.warn('⚠️  Source PDF not found, skipping file copy');
    }

    // Insert digital product
    await db.insert(digitalProducts).values({
      name: 'Ikigai Cards - Digital Edition',
      description: 'Complete digital version of our popular Ikigai self-discovery cards. Contains all 35 beautifully designed cards that help you explore your passions, mission, vocation, and profession to discover your life\'s purpose.',
      price: '14.95',
      originalPrice: '19.95',
      downloadUrl: '/api/download/{token}',
      fileName: 'ikigai-cards-digital.pdf',
      fileSize: '2.3',
      fileSizeUnit: 'MB',
      format: 'PDF',
      cardCount: 35,
      features: [
        'All 35 self-discovery cards',
        'High-quality printable PDF',
        'Works on any device',
        'Print unlimited copies',
        'Same content as physical version',
        'Instant digital access'
      ],
      isActive: true
    });

    console.log('✅ Digital products seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding digital products:', error);
    process.exit(1);
  }
}

// Run seeding
seedDigitalProducts().then(() => {
  console.log('🎉 Seeding completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Seeding failed:', error);
  process.exit(1);
});