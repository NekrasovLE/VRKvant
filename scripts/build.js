const fs = require('fs');
const path = require('path');

function parseFrontmatter(content) {
    const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
    if (match) {
        const frontmatterStr = match[1];
        const data = {};
        frontmatterStr.split(/\r?\n/).forEach(line => {
            const index = line.indexOf(':');
            if (index > -1) {
                const key = line.substring(0, index).trim();
                let value = line.substring(index + 1).trim();
                // Remove quotes
                value = value.replace(/^["']|["']$/g, '');
                // Basic array parsing for tags: [ "a", "b" ]
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
                }
                data[key] = value;
            }
        });
        return data;
    }
    return {};
}

function generateManifests(articlesDir = 'articles/') {
    const tracks = [];
    const cheats = [];
    const projects = [];

    const items = fs.readdirSync(articlesDir);

    items.forEach(item => {
        const itemPath = path.join(articlesDir, item);
        if (fs.statSync(itemPath).isDirectory()) {
            // It's a track or special folder
            if (item === 'cheats') {
                const files = fs.readdirSync(itemPath).filter(f => f.endsWith('.md'));
                files.forEach(file => {
                    const content = fs.readFileSync(path.join(itemPath, file), 'utf-8');
                    const fm = parseFrontmatter(content);
                    cheats.push({
                        title: fm.title || file.replace('.md', ''),
                        file: file
                    });
                });
            } else if (item === 'portfolio') {
                const files = fs.readdirSync(itemPath).filter(f => f.endsWith('.md'));
                files.forEach(file => {
                    const content = fs.readFileSync(path.join(itemPath, file), 'utf-8');
                    const fm = parseFrontmatter(content);
                    projects.push({
                        title: fm.title || file.replace('.md', ''),
                        description: fm.description || '',
                        authors: fm.authors || '',
                        tags: fm.tags || [],
                        image: fm.image || '',
                        file: file,
                        order: parseInt(fm.order || 9999)
                    });
                });
                projects.sort((a, b) => a.order - b.order);
            } else {
                // It's a track (e.g. unity, unreal, blender)
                const trackId = item;
                const lessonsData = [];
                const files = fs.readdirSync(itemPath).filter(f => f.endsWith('.md'));
                
                files.forEach(file => {
                    const content = fs.readFileSync(path.join(itemPath, file), 'utf-8');
                    const fm = parseFrontmatter(content);
                    lessonsData.push({
                        title: fm.title || file.replace('.md', ''),
                        file: file,
                        module: fm.module || 'Разное',
                        order: parseInt(fm.order || 9999)
                    });
                });

                const lessons = lessonsData.sort((a, b) => (a.order - b.order) || a.file.localeCompare(b.file));

                // Metadata from intro.md
                let trackMetadata = {};
                ['intro.md', 'index.md'].forEach(introFile => {
                    const introPath = path.join(itemPath, introFile);
                    if (fs.existsSync(introPath)) {
                        const content = fs.readFileSync(introPath, 'utf-8');
                        trackMetadata = parseFrontmatter(content);
                    }
                });

                tracks.push({
                    id: trackId,
                    name: trackMetadata.name || (trackId.charAt(0).toUpperCase() + trackId.slice(1) + ' Track'),
                    icon: trackMetadata.icon || `img/${trackId}/${trackId}_logo.jpg`,
                    colorClass: trackMetadata.colorClass || 'bg-gray-500',
                    lessons: lessons
                });
            }
        }
    });

    // Write JSONs
    fs.writeFileSync(path.join(articlesDir, 'tracks.json'), JSON.stringify({ tracks }, null, 2));
    fs.writeFileSync(path.join(articlesDir, 'cheats.json'), JSON.stringify({ cheats }, null, 2));
    fs.writeFileSync(path.join(articlesDir, 'portfolio.json'), JSON.stringify({ projects }, null, 2));

    console.log('Манифесты (tracks, cheats, portfolio) успешно сгенерированы на Node.js.');
}

generateManifests();
