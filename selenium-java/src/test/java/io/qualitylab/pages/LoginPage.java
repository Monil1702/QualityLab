package io.qualitylab.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public final class LoginPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By email = By.id("email");
    private final By password = By.id("password");
    private final By submit = By.cssSelector("button[type='submit']");
    private final By error = By.id("login-error");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    }

    public LoginPage open(String baseUrl) {
        driver.get(baseUrl);
        wait.until(ExpectedConditions.visibilityOfElementLocated(email));
        return this;
    }

    public StorePage signIn(String userEmail, String userPassword) {
        driver.findElement(email).sendKeys(userEmail);
        driver.findElement(password).sendKeys(userPassword);
        driver.findElement(submit).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("store-panel")));
        return new StorePage(driver);
    }

    public String signInExpectingFailure(String userEmail, String userPassword) {
        driver.findElement(email).sendKeys(userEmail);
        driver.findElement(password).sendKeys(userPassword);
        driver.findElement(submit).click();
        return wait.until(ExpectedConditions.visibilityOfElementLocated(error)).getText();
    }
}

