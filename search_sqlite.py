import os
import re

def search_sqlite_references(directory):
    """
    Search for sqlite3 references in all files within the given directory
    """
    sqlite_patterns = [
        r'sqlite3',
        r'\.db$',
        r'\.sqlite$',
        r'SQLite'
    ]
    
    results = []
    
    for root, dirs, files in os.walk(directory):
        # Skip node_modules and .git directories
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
            
        for file in files:
            # Skip binary files and certain extensions
            if file.endswith(('.pyc', '.png', '.jpg', '.gif', '.svg')):
                continue
                
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    for pattern in sqlite_patterns:
                        matches = re.finditer(pattern, content, re.IGNORECASE)
                        for match in matches:
                            # Get the line number
                            line_num = content.count('\n', 0, match.start()) + 1
                            # Get the line content
                            line = content.split('\n')[line_num - 1].strip()
                            results.append({
                                'file': file_path,
                                'line': line_num,
                                'content': line,
                                'pattern': pattern
                            })
            except UnicodeDecodeError:
                # Skip files that can't be read as text
                continue
                
    return results

# Example usage
if __name__ == "__main__":
    current_dir = os.getcwd()
    results = search_sqlite_references(current_dir)
    
    if results:
        print("Found sqlite3 references:")
        for result in results:
            print(f"\nFile: {result['file']}")
            print(f"Line {result['line']}: {result['content']}")
            print(f"Matched pattern: {result['pattern']}")
    else:
        print("No sqlite3 references found.")