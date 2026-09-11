package io.qualitylab.tests;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.net.MalformedURLException;
import java.net.URI;

abstract class BaseTest {
    protected WebDriver driver;
    protected String baseUrl;

    @BeforeEach
    void createDriver() throws MalformedURLException {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--window-size=1440,1000");
        String remoteUrl = System.getenv("SELENIUM_REMOTE_URL");
        driver = remoteUrl == null || remoteUrl.isBlank()
                ? new ChromeDriver(options)
                : new RemoteWebDriver(URI.create(remoteUrl).toURL(), options);
        baseUrl = System.getenv().getOrDefault("BASE_URL", "http://127.0.0.1:3000");
    }

    @AfterEach
    void quitDriver() {
        if (driver != null) {
            driver.quit();
        }
    }
}

