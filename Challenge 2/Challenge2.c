#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>
#include <regex.h>

#define MAX_SECRETS 100
#define MAX_SECRET_LENGTH 1000
#define MAX_RESPONSE_SIZE 50000

struct MemoryStruct {
    char *memory;
    size_t size;
};

static size_t WriteMemoryCallback(void *contents, size_t size, size_t nmemb, void *userp) {
    size_t realsize = size * nmemb;
    struct MemoryStruct *mem = (struct MemoryStruct *)userp;
    
    char *ptr = realloc(mem->memory, mem->size + realsize + 1);
    if (!ptr) {
        printf("Not enough memory (realloc returned NULL)\n");
        return 0;
    }
    
    mem->memory = ptr;
    memcpy(&(mem->memory[mem->size]), contents, realsize);
    mem->size += realsize;
    mem->memory[mem->size] = 0;
    
    return realsize;
}

char* fetch_scroll(const char* url) {
    CURL *curl_handle;
    CURLcode res;
    struct MemoryStruct chunk;
    
    chunk.memory = malloc(1);
    chunk.size = 0;
    
    curl_global_init(CURL_GLOBAL_ALL);
    curl_handle = curl_easy_init();
    
    if (curl_handle) {
        curl_easy_setopt(curl_handle, CURLOPT_URL, url);
        curl_easy_setopt(curl_handle, CURLOPT_WRITEFUNCTION, WriteMemoryCallback);
        curl_easy_setopt(curl_handle, CURLOPT_WRITEDATA, (void *)&chunk);
        curl_easy_setopt(curl_handle, CURLOPT_USERAGENT, "libcurl-agent/1.0");
        
        res = curl_easy_perform(curl_handle);
        
        if (res != CURLE_OK) {
            printf("curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
            free(chunk.memory);
            chunk.memory = NULL;
        }
        
        curl_easy_cleanup(curl_handle);
    }
    
    curl_global_cleanup();
    return chunk.memory;
}

int extract_secrets(const char* text, char secrets[][MAX_SECRET_LENGTH]) {
    regex_t regex;
    regmatch_t matches[2];
    int reti;
    int secret_count = 0;
    const char* pattern = "\\{\\*([^*]*)\\*\\}";
    
    reti = regcomp(&regex, pattern, REG_EXTENDED);
    if (reti) {
        printf("Could not compile regex\n");
        return 0;
    }
    
    const char* search_start = text;
    while (regexec(&regex, search_start, 2, matches, 0) == 0 && secret_count < MAX_SECRETS) {
        int match_length = matches[1].rm_eo - matches[1].rm_so;
        if (match_length < MAX_SECRET_LENGTH - 1) {
            strncpy(secrets[secret_count], search_start + matches[1].rm_so, match_length);
            secrets[secret_count][match_length] = '\0';
            secret_count++;
        }
        search_start += matches[0].rm_eo;
    }
    
    regfree(&regex);
    return secret_count;
}

void display_secrets(char secrets[][MAX_SECRET_LENGTH], int count) {
    printf("✨ Eldorian Secrets Revealed ✨\n");
    if (count == 0) {
        printf("No secrets found in the scroll.\n");
    } else {
        for (int i = 0; i < count; i++) {
            // Trim whitespace
            char* start = secrets[i];
            while (*start == ' ' || *start == '\t' || *start == '\n' || *start == '\r') start++;
            char* end = start + strlen(start) - 1;
            while (end > start && (*end == ' ' || *end == '\t' || *end == '\n' || *end == '\r')) end--;
            *(end + 1) = '\0';
            
            printf("%d. %s\n", i + 1, start);
        }
    }
}

int main() {
    const char* url = "https://raw.githubusercontent.com/microsoft/CopilotAdventures/main/Data/scrolls.txt";
    char* scroll_content = fetch_scroll(url);
    
    if (!scroll_content) {
        printf("Failed to retrieve the scroll.\n");
        return 1;
    }
    
    char secrets[MAX_SECRETS][MAX_SECRET_LENGTH];
    int secret_count = extract_secrets(scroll_content, secrets);
    
    display_secrets(secrets, secret_count);
    
    free(scroll_content);
    return 0;
}