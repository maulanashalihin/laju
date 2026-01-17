import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

class Command {
   public args: string[] = [];
   public commandName = "tailwind:migrate";

   public run() {
      const action = this.args[1];
      const validActions = ["to-v3", "to-v4", "check"];

      if (!action || !validActions.includes(action)) {
         console.log("\n🎨 Tailwind CSS Migration Tool");
         console.log("─────────────────────────────────\n");
         console.log("Usage: npm run tailwind:migrate <action>\n");
         console.log("Actions:");
         console.log("  to-v3   - Downgrade to Tailwind CSS v3");
         console.log("  to-v4   - Upgrade to Tailwind CSS v4");
         console.log("  check   - Check current version\n");
         process.exit(1);
      }

      if (action === "check") {
         this.checkVersion();
         return;
      }

      if (action === "to-v3") {
         this.migrateToV3();
      } else if (action === "to-v4") {
         this.migrateToV4();
      }
   }

   private checkVersion() {
      const packageJson = this.readPackageJson();
      const tailwindVersion = packageJson.dependencies?.tailwindcss || packageJson.devDependencies?.tailwindcss;

      console.log("\n📦 Current Tailwind CSS Version:");
      console.log("─────────────────────────────────");
      console.log(`Version: ${tailwindVersion || "Not installed"}`);

      const isV4 = tailwindVersion && tailwindVersion.startsWith("^4.");
      const isV3 = tailwindVersion && tailwindVersion.startsWith("^3.");

      if (isV4) {
         console.log("Status: Tailwind CSS v4 (CSS-first config)\n");
      } else if (isV3) {
         console.log("Status: Tailwind CSS v3 (JS config)\n");
      } else {
         console.log("Status: Unknown or not installed\n");
      }
   }

   private migrateToV3() {
      console.log("\n🔄 Migrating to Tailwind CSS v3...\n");

      const packageJson = this.readPackageJson();
      const currentVersion = packageJson.dependencies?.tailwindcss || packageJson.devDependencies?.tailwindcss;

      if (currentVersion && currentVersion.startsWith("^3.")) {
         console.log("✅ Already on Tailwind CSS v3");
         return;
      }

      console.log("📝 Updating package.json...");
      this.updatePackageJsonV3(packageJson);

      console.log("📝 Creating tailwind.config.js...");
      this.createTailwindConfigV3();

      console.log("📝 Updating postcss.config.mjs...");
      this.updatePostcssConfigV3();

      console.log("📝 Updating CSS imports...");
      this.updateCssImportsV3();

      console.log("📝 Reverting vite.config.mjs...");
      this.revertViteConfigV3();

      console.log("\n🚀 Installing dependencies...");
      try {
         execSync("npm install", { stdio: "inherit" });
         console.log("\n✅ Successfully migrated to Tailwind CSS v3!");
         console.log("\n📋 Next steps:");
         console.log("   - Review tailwind.config.js for customizations");
         console.log("   - Run npm run dev to test\n");
      } catch (error) {
         console.error("\n❌ Installation failed:", error);
         process.exit(1);
      }
   }

   private migrateToV4() {
      console.log("\n🔄 Migrating to Tailwind CSS v4...\n");

      const packageJson = this.readPackageJson();
      const currentVersion = packageJson.dependencies?.tailwindcss || packageJson.devDependencies?.tailwindcss;

      if (currentVersion && currentVersion.startsWith("^4.")) {
         console.log("✅ Already on Tailwind CSS v4");
         return;
      }

      console.log("📝 Updating package.json...");
      this.updatePackageJsonV4(packageJson);

      console.log("📝 Removing PostCSS config (not needed in v4)...");
      this.removePostcssConfig();

      console.log("📝 Creating CSS configuration...");
      this.createCssConfigV4();

      console.log("📝 Backing up tailwind.config.js...");
      this.backupTailwindConfig();

      console.log("📝 Updating vite.config.mjs...");
      this.updateViteConfigV4();

      console.log("\n🚀 Installing dependencies...");
      try {
         execSync("npm install", { stdio: "inherit" });
         console.log("\n✅ Successfully migrated to Tailwind CSS v4!");
         console.log("\n📋 Next steps:");
         console.log("   - Review resources/js/index.css for customizations");
         console.log("   - tailwind.config.js backed up as tailwind.config.js.backup");
         console.log("   - Run npm run dev to test\n");
      } catch (error) {
         console.error("\n❌ Installation failed:", error);
         process.exit(1);
      }
   }

   private readPackageJson(): any {
      const packagePath = path.resolve("package.json");
      const content = fs.readFileSync(packagePath, "utf-8");
      return JSON.parse(content);
   }

   private writePackageJson(packageJson: any) {
      const packagePath = path.resolve("package.json");
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + "\n");
   }

   private updatePackageJsonV3(packageJson: any) {
      if (packageJson.dependencies?.tailwindcss) {
         packageJson.dependencies.tailwindcss = "^3.4.17";
      }
      if (packageJson.devDependencies?.tailwindcss) {
         packageJson.devDependencies.tailwindcss = "^3.4.17";
      }

      if (!packageJson.devDependencies?.autoprefixer) {
         if (!packageJson.devDependencies) packageJson.devDependencies = {};
         packageJson.devDependencies.autoprefixer = "^10.4.23";
      }

      this.writePackageJson(packageJson);
      console.log("   ✓ Updated tailwindcss to ^3.4.17");
   }

   private updatePackageJsonV4(packageJson: any) {
      if (packageJson.dependencies?.tailwindcss) {
         packageJson.dependencies.tailwindcss = "^4.0.0";
      }
      if (packageJson.devDependencies?.tailwindcss) {
         packageJson.devDependencies.tailwindcss = "^4.0.0";
      }

      // Add @tailwindcss/vite plugin
      if (!packageJson.devDependencies) packageJson.devDependencies = {};
      if (!packageJson.devDependencies['@tailwindcss/vite']) {
         packageJson.devDependencies['@tailwindcss/vite'] = "^4.0.0";
      }

      this.writePackageJson(packageJson);
      console.log("   ✓ Updated tailwindcss to ^4.0.0");
      console.log("   ✓ Added @tailwindcss/vite plugin");
   }

   private createTailwindConfigV3() {
      const configPath = path.resolve("tailwind.config.js");
      const configContent = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.{svelte,html,js,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          900: '#431407',
        },
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        slate: {
          850: '#1e293b',
          950: '#020617',
        },
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
      animation: {
        blob: 'blob 7s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
`;
      fs.writeFileSync(configPath, configContent);
      console.log("   ✓ Created tailwind.config.js");
   }

   private updatePostcssConfigV3() {
      const configPath = path.resolve("postcss.config.mjs");
      const configContent = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
      fs.writeFileSync(configPath, configContent);
      console.log("   ✓ Updated postcss.config.mjs");
   }

   private removePostcssConfig() {
      const configPath = path.resolve("postcss.config.mjs");
      if (fs.existsSync(configPath)) {
         fs.unlinkSync(configPath);
         console.log("   ✓ Removed postcss.config.mjs");
      } else {
         console.log("   ✓ No PostCSS config to remove");
      }
   }

   private createCssConfigV4() {
      const cssPath = path.resolve("resources/js/index.css");
      const cssContent = `@import "tailwindcss";

@theme {
  --font-family-sans: 'Inter', sans-serif;
  --font-family-mono: 'Fira Code', monospace;

  --color-brand-400: #fb923c;
  --color-brand-500: #f97316;
  --color-brand-600: #ea580c;
  --color-brand-900: #431407;

  --color-primary-50: #fff7ed;
  --color-primary-100: #ffedd5;
  --color-primary-200: #fed7aa;
  --color-primary-300: #fdba74;
  --color-primary-400: #fb923c;
  --color-primary-500: #f97316;
  --color-primary-600: #ea580c;
  --color-primary-700: #c2410c;
  --color-primary-800: #9a3412;
  --color-primary-900: #7c2d12;
  --color-primary-950: #431407;

  --color-slate-850: #1e293b;
  --color-slate-950: #020617;

  --shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04);

  --animate-blob: blob 7s infinite;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
`;
      fs.writeFileSync(cssPath, cssContent);
      console.log("   ✓ Created CSS configuration in resources/js/index.css");
   }

   private updateCssImportsV3() {
      const cssPath = path.resolve("resources/js/index.css");
      const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
      fs.writeFileSync(cssPath, cssContent);
      console.log("   ✓ Updated CSS imports for v3");
   }

   private backupTailwindConfig() {
      const configPath = path.resolve("tailwind.config.js");
      const backupPath = path.resolve("tailwind.config.js.backup");

      if (fs.existsSync(configPath)) {
         fs.copyFileSync(configPath, backupPath);
         console.log("   ✓ Backed up tailwind.config.js");
      }
   }

   private updateViteConfigV4() {
      const configPath = path.resolve("vite.config.mjs");
      let content = fs.readFileSync(configPath, "utf-8");

      // Add import if not exists
      if (!content.includes("import tailwindcss from '@tailwindcss/vite'")) {
         content = content.replace(
            "import { svelte } from '@sveltejs/vite-plugin-svelte'",
            "import { svelte } from '@sveltejs/vite-plugin-svelte'\nimport tailwindcss from '@tailwindcss/vite'"
         );
      }

      // Add plugin to plugins array if not exists
      if (!content.includes("tailwindcss(),")) {
         content = content.replace(
            "plugins: [\n    svelte(),",
            "plugins: [\n    tailwindcss(),\n    svelte(),"
         );
      }

      fs.writeFileSync(configPath, content);
      console.log("   ✓ Updated vite.config.mjs");
   }

   private revertViteConfigV3() {
      const configPath = path.resolve("vite.config.mjs");
      let content = fs.readFileSync(configPath, "utf-8");

      // Remove import
      content = content.replace(
         /import tailwindcss from '@tailwindcss\/vite'\n/,
         ""
      );

      // Remove plugin from plugins array
      content = content.replace(
         "plugins: [\n    tailwindcss(),\n    svelte(),",
         "plugins: [\n    svelte(),"
      );

      fs.writeFileSync(configPath, content);
      console.log("   ✓ Reverted vite.config.mjs");
   }
}

const cmd = new Command();
cmd.args = ["", ...process.argv.slice(2)];
cmd.run();

export default new Command();
